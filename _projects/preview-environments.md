---
title: "Preview Environments"
role: "Engineering Lead"
org: "Proda"
start_date: "2024-04-01"
tags:
    - Kubernetes
    - Nginx Ingress
    - CI/CD
    - Devops
    - Github
---

CI-automated, on-demand PR preview environments running on Kubernetes — namespaced per PR. Using nginx ingress controller, cert-manager, external-dns and external-secrets to provision a fully isolated, routable, TLS-secured environment for every change.

Replaced a workflow with *no way to preview a change before merge*: CI took *30 minutes to 1 hour* to run, and every merge landed on a shared Staging environment that was tested manually once a day. Reviews were consequently slow.

Now running *15 previews* at any given time — *30 previews spun up across 300 PRs* in the last month alone. Still in active use.
