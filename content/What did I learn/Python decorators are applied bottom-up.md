---
title: Python decorators are applied bottom-up
tags:
  - python
  - decorators
sources:
  - https://docs.python.org/3/reference/compound_stmts.html#function
  - https://stackoverflow.com/questions/739654/how-do-i-make-function-decorators-and-chain-them-together#answer-739665
---
# Description

Multiple decorators are applied in nested fashion. When passed as arguments to a function, the closest to `def function()` must be the first.

# Example

```python
@f1(arg)
@f2
def func(): pass
```
is roughly equivalent to
```python
def func(): pass
func = f1(arg)(f2(func))
```