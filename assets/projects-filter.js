/**
 * Projects Filter Module
 * Handles multi-tag filtering with URL query string support
 */
(function() {
    'use strict';

    const ProjectsFilter = {
        /**
         * Initialize the filter functionality
         */
        init: function() {
            this.filterContainer = document.getElementById('project-filters');
            if (!this.filterContainer) return;

            this.projectsContainer = document.querySelector('.flex.column');
            if (!this.projectsContainer) return;

            this.tagLinks = this.filterContainer.querySelectorAll('.tag-cloud a');
            this.resetButton = this.filterContainer.querySelector('.reset-filters');



            // Parse URL params and initialize state
            this.currentFilters = this.parseUrlParams();
            this.activeTags = new Set(this.currentFilters);

            // Update UI based on initial filters - just update tag link states
            this.updateTagLinkStates();

            // Bind events
            this.bindEvents();

            // Apply initial filter
            this.applyFilter();
        },

        /**
         * Parse URL query parameters to get filter tags
         * @returns {Array} Array of tag names from URL
         */
        parseUrlParams: function() {
            const params = new URLSearchParams(window.location.search);
            const tagsParam = params.get('tags');
            if (!tagsParam) return [];
            return tagsParam.split(',').map(t => decodeURIComponent(t.trim())).filter(t => t);
        },

        /**
         * Update URL with current filters
         */
        updateUrl: function() {
            const params = new URLSearchParams(window.location.search);
            const tags = Array.from(this.activeTags).filter(t => t).join(',');
            
            if (tags) {
                params.set('tags', tags);
            } else {
                params.delete('tags');
            }

            const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
            window.history.pushState({}, '', newUrl);
        },

        /**
         * Bind event listeners
         */
        bindEvents: function() {
            // Tag link clicks
            this.tagLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const tagName = link.textContent.trim();
                    this.toggleTag(tagName);
                });
            });

            // Reset button click
            if (this.resetButton) {
                this.resetButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.resetFilters();
                });
            }

            // Handle browser back/forward navigation
            window.addEventListener('popstate', () => {
                this.currentFilters = this.parseUrlParams();
                this.activeTags = new Set(this.currentFilters);
                this.updateTagLinkStates();
                this.applyFilter();
            });
        },

        /**
         * Toggle a tag in the active filters
         * @param {string} tagName - The tag name to toggle
         */
        toggleTag: function(tagName) {
            if (this.activeTags.has(tagName)) {
                this.activeTags.delete(tagName);
            } else {
                this.activeTags.add(tagName);
            }

            this.updateTagLinkStates();
            this.updateUrl();
            this.applyFilter();
        },

        /**
         * Reset all filters
         */
        resetFilters: function() {
            this.activeTags.clear();
            this.updateTagLinkStates();
            this.updateUrl();
            this.applyFilter();
        },

        /**
         * Update the visual state of tag links
         */
        updateTagLinkStates: function() {
            this.tagLinks.forEach(link => {
                const tagName = link.textContent.trim();
                if (this.activeTags.has(tagName)) {
                    link.classList.add('active');
                    link.setAttribute('aria-pressed', 'true');
                } else {
                    link.classList.remove('active');
                    link.setAttribute('aria-pressed', 'false');
                }
            });
        },

        /**
         * Apply the current filters to the projects
         * Uses OR logic - project matches if it has ANY of the selected tags
         */
        applyFilter: function() {
            if (this.activeTags.size === 0) {
                // No filters - show all projects
                this.showAllProjects();
                return;
            }

            const activeTags = Array.from(this.activeTags);
            const projects = this.projectsContainer.querySelectorAll('article.project');

            projects.forEach(project => {
                const projectTags = this.getProjectTags(project);
                // OR logic: show if project has ANY of the active tags
                const matches = activeTags.some(tag => projectTags.includes(tag));
                project.style.display = matches ? '' : 'none';
            });
        },

        /**
         * Show all projects
         */
        showAllProjects: function() {
            const projects = this.projectsContainer.querySelectorAll('article.project');
            projects.forEach(project => {
                project.style.display = '';
            });
        },

        /**
         * Get tags for a project element
         * @param {HTMLElement} project - The project element
         * @returns {Array} Array of tag names
         */
        getProjectTags: function(project) {
            const tagElements = project.querySelectorAll('ul.tags li a, ul.tags li span');
            return Array.from(tagElements).map(el => el.textContent.trim());
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ProjectsFilter.init());
    } else {
        ProjectsFilter.init();
    }
})();
