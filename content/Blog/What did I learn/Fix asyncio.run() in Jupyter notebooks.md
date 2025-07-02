---
title: Fix asyncio.run() in Jupyter notebook
tags:
  - jupyter
  - asyncio
  - python
sources:
  - https://github.com/python/cpython/issues/66435
date: 2024-11-16
---
# Description

By design, `asyncio` does not allow its event loop to be nested. This presents a practical problem in Jupyter notebooks because the notebook itself runs inside an event loop. Consequently, you cannot use `asyncio.run()` to execute tasks and wait for the result in the standard way.

# Example

```python
import asyncio

async def test_async():  
    print("Starting async function")  
    await asyncio.sleep(1)  
    print("Async function completed")

asyncio.run(test_async())
```

ran in a notebook cell will raise:

```>>> RuntimeError: asyncio.run() cannot be called from a running event loop```

### Solutions

You have two options to resolve this issue:
1) In modern JupyterLab or Jupyter Notebook environments (specifically, those using IPython version 7.0 or newer), you can **directly `await` a coroutine in a cell**:
	```python
	await test_async()
	```
	
	```
	>>> Starting async function
	>>> Async function completed
	```
2) **Use [nest_asyncio](https://pypi.org/project/nest-asyncio/)** to allow the event loop to be nested. This approach keeps your code closer to how it would look in a standard Python (`.py`) file:
	First install nest_asyncio with the package manager of your choice:
    ```shell
	pip install nest_asyncio
	```
	Then, apply the patch at the beginning of the notebook:
	```python
	import asyncio
	import nest_asyncio
	
	nest_asyncio.apply()
	
	async def test_async():  
	    print("Starting async function")  
	    await asyncio.sleep(1)  
	    print("Async function completed")

	asyncio.run(test_async())
	```
	
	```
	>>> Starting async function
	>>> Async function completed
	```