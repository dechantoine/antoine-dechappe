---
title: The 12 ? factors ML app
draft: true
tags: 
date: 2025-03-02
---

# 0 - Siloed training of model, serving and user-facing app
# 1 - Codebase

# 2 - Artifacts

# 3 - Dependencies

## poetry
## uv

Need to assess if it is a real poetry killer

https://www.bitecode.dev/p/a-year-of-uv-pros-cons-and-should


# 4 - Config

# 5 - Backing services

# 6 - APIs everywhere

## Why ?

*Define explicit boundaries to your application.*

- Be the closest to user stories and requirements.
- Clearly expose the functionalities of your application without the necessity to dive into internal mechanisms.
- State with contract how to consume your functionalities.

## How ?

Export services via port binding:
- Use FastAPI or Flask to expose your functionalities.
- Use Pydantic to define and enforce clear payloads.

# 7 - Dev / prod parity

## Why ?
 
 *Keep development, staging, and production as similar as possible.*

- Make the time gap small: a ML Engineer may write code and have it deployed hours or even just minutes later.
- Make the personnel gap small: ML engineers who wrote code are closely involved in deploying it with MLOps and watching its behavior in production.
- Make the tools gap small: keep development and production as similar as possible.

## How ?

- Make use of existing libraries which simplify access to backing services.
- Define Abstract Base Classes unifying your interactions with other services.
- Use Docker to closely approximate production environments.

# 8 - Build, release, run

# 9 - Disposability

## Why ?

*Maximize robustness with fast startup and graceful shutdown.*

# 10 - Logs

# 11 - A/B testing 



# ~~7 - Processes~~

# ~~9 - Concurrency~~

# ~~13 - Admin processes~~