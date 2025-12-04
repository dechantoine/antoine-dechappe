---
title: How to correctly type a Python function that returns an instance of a Pydantic class passed as an argument?
tags:
  - pydantic
  - typing
sources:
  - https://docs.python.org/3/library/typing.html#generics
date: 2025-12-04
---
# Description

In MLOps and complex Python applications, it's common to use **factory functions** to dynamically create instances of classes, such as Pydantic models. 

For example, you might have one function that loads data and instantiates a `Product` model in one call, and an `Order` model in another. The challenge is how to properly **type-hint** this factory function to guarantee to the static type checker (like MyPy) that the returned object is an instance of the specific Pydantic model class passed as an argument. 

Without correct typing, you lose the benefits of Pydantic's inherent structure and type safety. The solution requires leveraging **Generic Types** using Python's `typing` module, specifically `TypeVar` and `Type`. 
# Example

Let's define a simple function manipulating Pydantic class: one that instantiates an object of a such class given data.
This untyped function will cause your editor and type checker to lose track of the return type:

```python 
from pydantic import BaseModel 
from typing import Dict, Any 

class Product(BaseModel): 
	id: int 
	price: float
	
# Bad: The return type is vague (BaseModel or Any) 
def instantiate_model_untyped(model_cls, raw_data): 
	return model_cls(**raw_data) 
	
# 'product' is typed as 'Any' or 'BaseModel' 
product = instantiate_model_untyped(Product, {"id": 1, "price": 10.5}) 

# Your editor can't guarantee 'id' exists on the object! 
# This is a major risk for production code. 
# print(product.id)
```

# Solution

The fix is to introduce a **Type Variable** (`TypeVar`) to create a generic relationship between the input class and the output instance. This links the two types, preserving the necessary type information.

**💡 Breakdown of the Type Hints**
- **`T = TypeVar('T', bound=BaseModel)`**: This creates a placeholder type `T` that **must** be a subclass of `BaseModel`.
- **`model_cls: Type[T]`**: This specifies that the argument must be a **class object** (`Type`) of the generic type `T`. If you pass `Product`, then `T` becomes `Product`.
- **`-> T`**: This states that the function returns an **instance** of the specific type `T` (which is `Product` in our example), preserving the strong type hint.

```python 
from pydantic import BaseModel 
from typing import TypeVar, Type, Dict, Any, List 
import unittest

# 1. Define a Type Variable (T) 
# T is constrained to only accept classes that inherit from BaseModel. 
T = TypeVar('T', bound=BaseModel)

class Product(BaseModel): 
	id: int 
	price: float

class Order(BaseModel): 
	order_id: int 
	total_items: int
	
# 2. Use Type[T] to type-hint the argument and T for the return
def instantiate_model(model_cls: Type[T], raw_data: Dict[str, Any]) -> T:
	"""
	Type-safe factory function that instantiates a Pydantic model. 
	
	Args: 
		model_cls: The Pydantic BaseModel class (Type[T]) to be instantiated.
		raw_data: The dictionary data used for model construction/validation.
		
	Returns: 
		An instance of the specific class T passed in 'model_cls'. 
	"""
	return model_cls(**raw_data) 
	
# 3. Usage
product_data = {"id": 1, "price": 10.5}
order_data = {"order_id": 99, "total_items": 5}

# The returned object is correctly typed as 'Product' 
product: Product = instantiate_model(Product, product_data) 

# The returned object is correctly typed as 'Order' 
order: Order = instantiate_model(Order, order_data) 

# Type-safe attribute access is now guaranteed: 
print(f"Product SKU: {product.sku}") 
print(f"Order ID: {order.order_id}")
```