---
title: Rentroll Standardisation Port
role: Engineering Lead
org: Proda
start_date: 2024-08-01
tags:
  - Kotlin
  - Python
  - Haskell
  - Software Development
---

Strangler-fig extraction of rentroll standardisation from a legacy Haskell monolith. Initial *6-month* rewrite as a stateless Python service, running numerous experiments to improve standardisation accuracy and configurability. Ported again to Kotlin over *2 weeks* (initially as experiement) but became the successor.

Delivered a *10x performance improvement* and a codebase engineers find significantly easier to support than the original monolith.

Processes *~7,000 standardisations a month*, with individual runs taking anywhere from *a few seconds to 5 minutes*.
