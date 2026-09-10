---
title: Multi-Region Platform Hosting
role: Engineering Lead
company: Proda
start_date: 2026-01-01
tags:
  - Terraform
  - ArgoCD
  - Kubernetes
  - GCP
  - Devops
---

3-month project refactoring *~15 services* onto centralised Terraform modules and ArgoCD-driven deployment, giving the platform the capability to be stood up in an entirely new GCP region from scratch.

The project had dual motivations: resilience, and a client data-residency requirement.

Recovery from total regional loss was previously impossible and now takes < 1/2 day.
