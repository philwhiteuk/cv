---
title: "Document Ingestion MCP"
role: "Engineering Lead"
org: "Proda"
start_date: "2026-04-01"
tags:
- "MCP"
- "FastMCP"
- "Prefab"
- "Auth0"
- "Python"
- "Leadership"
---

2-person team building an authenticated MCP server for document ingestion, giving an LLM client the ability to parse and reason over a user's documents directly.

Built on FastMCP with Prefab. Every connection was authenticated via Auth0 so each user was individually identifiable and scoped to only the data they had access to — solving a seamless auth flow for the end user was the biggest technical breakthrough on the project.

Large file upload isn't yet part of the MCP spec, so we built a FastMCP App to provide a smooth in-client upload UI. Experimented with structured data parsing across spreadsheets and PDFs, data extraction, and simple analysis on top of ingested documents.

Reached a *working prototype*, but paused before landing a client — currently only one client has permission to run frontier models against their data. Shelved for now, with plans to revisit as agentic workflow adoption grows more broadly.
