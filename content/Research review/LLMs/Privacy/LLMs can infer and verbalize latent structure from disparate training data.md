---
title: LLMs can infer and verbalize latent structure from disparate training data
draft: false
tags: 
paper: https://arxiv.org/pdf/2406.14546
code: https://github.com/choidami/inductive-oocr
date: 2025-02-07
---
## Abstract

One way to address safety risks from LLMs is to censor dangerous knowledge from their training data. While this removes the explicit information, implicit information can remain scattered across various training documents. Could an LLM infer the censored knowledge by piecing together these implicit hints? As a step towards answering this question, this paper studies inductive out-of-context reasoning (OOCR), a type of generalization in which LLMs infer latent information from evidence distributed across training documents and apply it to downstream tasks without in-context learning. Using a suite of five tasks, it demonstrates that frontier LLMs can perform inductive OOCR. While OOCR succeeds in a range of cases, it is also unreliable, particularly for smaller LLMs learning complex structures. Overall, the ability of LLMs to “connect the dots” without explicit in-context learning poses a potential obstacle to monitoring and controlling the knowledge acquired by LLMs.

## Key takeaways

- LLMs can perform inductive out-of-context reasoning (OOCR), **inferring latent information from evidence distributed across training documents and applying it to downstream tasks** without in-context learning.
- Inductive OOCR can **enable an LLM to acquire and use knowledge in a way that is difficult for humans to monitor because it is never explicitly written down**.
- Inductive OOCR performance **can surpass in-context learning performance**.
- Inductive OOCR works even when the training data is stochastic and the model has to aggregate large numbers of training data points. It is also possible even without variable names.
- The effectiveness of inductive OOCR varies, with performance being unreliable, particularly for smaller LLMs learning complex structures. It can be both high variance and sensitive to prompts, especially on more complex latent structures.
- While the potential for inductive OOCR exists, **current models are unlikely to exhibit this ability in safety-relevant contexts**, which would require much more complex out-of-context reasoning abilities

## Experiment

### Preliminary concepts

- Inductive Out-Of-Context Reasoning is the ability of an LLM to — given a training dataset _D_ containing many indirect observations of some latent _z_ — infer the value of _z_ and apply this knowledge downstream. Inductive OOCR is out-of-context because the observations of _z_ are only seen during training.
![](assets/llms_can_infer_0.png)

 - Baselines: to show that inductive OOCR is taking place, it is necessary to rule out that models could succeed at evaluations without having actually learned the latent values. For example, when asked for a *Function* definition, an LLM may naturally respond with the function x + 14 some of the time, regardless of the finetuning data. To address this bias, for examples in *Functions*:
	 - the model is trained on 19 different functions with different variable names.
	 - OOCR performance is measured by prompting the model to output a definition for one of the variables and evaluating on the correct definition.
	 - the baseline is computed by evaluating on the same target definition, but prompting with random other variable names. Averaged over all 19 functions, this baseline evaluates to random chance (1/19) if the model always outputs one of the 19 valid definitions.

### Objectives

The primary objective of this paper is to **investigate whether LLMs can infer latent information from indirect observations in training data** and **apply this knowledge to downstream tasks without in-context learning**.
The experiments aim to **evaluate the inductive out-of-context reasoning (OOCR) capabilities** of LLMs across a suite of diverse tasks. 
The study also seeks to **compare the performance of OOCR with in-context learning** and to assess the impact of model size on OOCR abilities.

### Setup

- Models: 
	- GPT-3.5 and GPT-4
	- Llama 3-8B and Llama 3-70B
- Datasets: The paper uses five different tasks to evaluate OOCR:
	- *Locations*: LLMs are trained to predict distances between an unknown city and known cities to infer the unknown city's identity
	- *Coins*: LLMs learn the biases of coins by predicting coin flips
	- *Functions*: LLMs learn mathematical functions by predicting function outputs
	- *Mixture of Functions*: LLMs learn an unnamed distribution over functions from function outputs
	- *Parity Learning*: LLMs learn a Boolean assignment from parity formulas
	- For all tasks except Locations, **the training data was formatted as Python files** because this improved performance.
	- The **fine-tuning data is in chat format with system, user, and assistant messages**, and models were only trained on assistant messages.
	- The training data included paraphrases and syntactic variations of each document to avoid overfitting.
	![](assets/llms_can_infer_1.png)
- Hyperparameters:
	- The GPT models: finetuned using OpenAI's finetuning API (batch size = 32, learning rate multiplier = 10)
	- Llama3-8B model: a single A100
	- Llama-70B model: 4 A100’s with a per-device batch size of 16; cosine learning rate decay with a warmup of 100 steps , where the peak learning rate is 1e-5, and the end learning rate is 1e-6. A weight decay value of 1e-4 was used.
- Metrics:
	- probability the model assigned to the correct answer.
	- For multi-token responses, the probability is approximated by sampling many times.
	- The study also uses total variation distance to measure the difference between the ground truth distribution and the model's outputs.
	- Error in kilometers is used to evaluate the distance prediction task in the Locations experiment.
- The models were never finetuned on reflection evaluations, except for function addition and composition.

## Results

![](assets/llms_can_infer_2.png)
![](assets/llms_can_infer_3.png)
![](assets/llms_can_infer_4.png)
![](assets/llms_can_infer_5.png)