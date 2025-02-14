---
title: "Coconut: Continuous latent space reasoning for language models"
draft: false
tags: 
paper: https://arxiv.org/pdf/2412.06769
code: 
date: 2025-02-14
---
## Abstract

Coconut (Chain of Continuous Thought) is a new paradigm that enables large language models (LLMs) to reason in an unrestricted latent space rather than being confined to the "language space".
The prevalent approach of chain-of-thought (CoT) reasoning requires LLMs to generate solutions step-by-step using natural language, but the language network in the human brain remains largely inactive during reasoning tasks, suggesting that human language is optimized for communication rather than reasoning. Furthermore, when LLMs use language for reasoning, the amount of reasoning required for each token varies greatly, yet current LLM architectures allocate nearly the same computing budget for predicting every token. Most tokens in a reasoning chain are generated solely for fluency, contributing little to the actual reasoning process, while some critical tokens require complex planning and pose huge challenges to LLMs.
Coconut addresses these limitations by utilizing the last hidden state of the LLM as a representation of the reasoning state ("continuous thought") and feeding it back to the LLM as the subsequent input embedding directly in the continuous space. Experiments show that Coconut effectively augments the LLM on several reasoning tasks. This latent reasoning paradigm leads to emergent advanced reasoning patterns, where the continuous thought can encode multiple alternative next reasoning steps, allowing the model to perform a breadth-first search (BFS) to solve the problem, rather than committing to a single deterministic path like CoT. Coconut outperforms CoT in logical reasoning tasks that require substantial backtracking during planning, with fewer thinking tokens during inference.
![](assets/coconut_0.png)

## Key takeaways

- LLMs can reason effectively in a continuous latent space, offering an **alternative to language-based reasoning**. The "Chain of Continuous Thought" (Coconut) paradigm uses the **last hidden state of the LLM as a representation of the reasoning state**, feeding it back as the subsequent input embedding.
- Reasoning in latent space allows for **more efficient encoding of multiple potential reasoning steps**, enabling a breadth-first search (BFS)-like approach. This contrasts with chain-of-thought (CoT) methods that commit to a single deterministic path too early.
- **Coconut outperforms CoT** in logical reasoning tasks requiring substantial backtracking **while using fewer tokens during inference**, suggesting that latent reasoning is more efficient.
- Multi-stage training, inspired by iCoT, is effective for training latent reasoning, utilizing language reasoning chains to guide the training process.
- **Continuous thoughts are fully differentiable**, allowing end-to-end optimization via gradient descent.
- Latent reasoning benefits from a "chaining" effect, similar to CoT, where multiple continuous thoughts enhance expressiveness and problem-solving capabilities.
- **Guidance is needed to learn latent reasoning**. Models trained without a curriculum do not perform better than No-CoT.
- Latent reasoning is advantageous for planning because it delays definite decisions, allowing the model to push its exploration closer to the search tree's terminal states, making it easier to distinguish correct nodes from incorrect ones.
- While it is possible to save any repetitive computing by using a KV cache, the sequential nature of the multiple forward passes in training poses challenges for parallelism.

## Experiment

### Preliminary concepts

- The Coconut paradigm use the hyperparameter 'c' to set how many continuous thoughts will replace a step in a Chain-of-Thought. While a step is almost made of an unpredictable number of tokens, the Coconut reasoning is assured to be complete one step in 'c' forward pass.
- A challenge lies in determining when to switch between latent and language modes. Since the experiments focus on problem-solving setting, a \<bot> token is immediately inserted following the question tokens. For \<eot>, two potential strategies were considered: 
	- train a binary classifier on latent thoughts to enable the model to autonomously decide when to terminate the latent reasoning
	- always pad the latent thoughts to a constant length

### Objectives

The primary objectives of the experiments are :
- to validate the feasibility and effectiveness of LLM reasoning in a continuous latent space.
- to compare it against traditional language-based reasoning methods like chain-of-thought (CoT).
- to test the hypothesis that continuous thoughts can encode multiple potential next steps simultaneously, enabling a breadth-first search (BFS)-like reasoning process.
- to evaluate the extent to which this latent reasoning paradigm can enhance the reasoning capabilities of LLMs.

### Setup

- **Models**: pre-trained GPT-2 as the base model for all experiments.
- **Datasets**: 
	- *GSM8k*: A dataset for math reasoning consisting of grade school-level math problems.
	- *ProntoQA*: A logical reasoning dataset with 5-hop questions using fictional concept names and tree-structured ontologies.
	- *ProsQA*: A newly proposed dataset for logical reasoning that requires stronger planning ability, using randomly generated DAGs to structure known conditions.
- **Hyperparameters**: 
	- learning rate is set to 1 × 10−4.
	- effective batch size is 12812. 
	- optimizer state is reset when training stages switch (training on reasoning step n+1).
	- for math reasoning, 2 latent thoughts (c = 2) were used for each reasoning step, while for logical reasoning, 1 continuous thought (c = 1) was used for every reasoning step.
- **Metrics**: 
	- the primary evaluation metric is accuracy, comparing model-generated answers with the ground truth.
	- the number of newly generated tokens per question is analyzed to measure reasoning efficiency. 
	- for fine-grained analysis of the reasoning process on the ProsQA dataset, the reasoning paths were classified into categories such as Correct Path, Longer Path, Hallucination, and Wrong Target.
- **The Coconut paradigm**:
	- feeding the last hidden state of the LLM directly as the input embedding for the next token, allowing the LLM to reason in a latent space instead of a language space.
	- special tokens \<bot> and \<eot> are used to mark the beginning and end of the latent thought mode.
	- multi-stage training curriculum is employed, where language CoT data is used to supervise continuous thought by gradually replacing language reasoning steps with continuous thoughts in multiple stages.
	- the loss is the normal negative log-likelihood, but masked on questions and latent thoughts, in order to not encourage the continuous thought to compress the removed language thought, but rather to facilitate the prediction of future reasoning.
	![](assets/coconut_1.png)
## Results

![](assets/coconut_2.png)
![](assets/coconut_4.png)

Methods:
- Baselines:
	- CoT: use the complete reasoning chains to train the language model with supervised finetuning, and during inference, the model generates a reasoning chain before outputting an answer.
	- No-CoT: the LLM is trained to directly generate the answer without using a reasoning chain.
	- iCoT: the model is trained with language reasoning chains and follows a carefully designed schedule that “internalizes” CoT. As the training goes on, tokens at the beginning of the reasoning chain are gradually removed until only the answer remains. During inference, the model directly predicts the answer. 
	- Pause token: the model is trained using only the question and answer, without a reasoning chain. However, different from No-CoT, special tokens are inserted between the question and answer, which are believed to provide the model with additional computational capacity to derive the answer. For a fair comparison, the number of tokens is set the same as continuous thoughts in Coconut.
- Coconut flavors:
	- W/O curriculum: instead of the multi-stage training, directly use the data from the last stage which only includes questions and answers to train Coconut. The model uses continuous thoughts to solve the whole problem. 
	- W/O thought: keep the multi-stage training which removes language reasoning steps gradually, but don’t use any continuous latent thoughts. While this is similar to iCoT in the high-level idea, the exact training schedule is set to be consistent with Coconut, instead of iCoT. This ensures a more strict comparison. 
	- Pause as thought: use special tokens to replace the continuous thoughts, and apply the same multi-stage training curriculum as Coconut.

![](assets/coconut_3.png)