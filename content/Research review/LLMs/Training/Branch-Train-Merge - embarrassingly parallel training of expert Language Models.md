---
title: "Branch-Train-Merge: embarrassingly parallel training of expert Language Models"
draft: false
tags: 
paper: https://arxiv.org/pdf/2208.03306
code: https://github.com/hadasah/btm
date: 2024-09-20
---
## Abstract

**Branch-Train-Merge** (BTM) is a communication-efficient algorithm for parallel training of large language models (LLMs). It shows it is possible to independently train subparts of a new class of LLMs on different subsets of the data, eliminating the massive multi-node synchronization currently required to train LLMs. BTM learns a set of independent **EXPERT LMs** (ELMs), each specialized to a different textual domain. These ELMs can be added and removed to update data coverage, ensembled to generalize to new domains, or averaged to collapse back to a single LM for efficient inference. New ELMs are learned by branching from (mixtures of) ELMs in the current set, further training the parameters on data for the new domain, and then merging the resulting model back into the set for future use. Experiments show that BTM improves in- and out-of-domain perplexities as compared to GPT-style Transformer LMs, when controlling for training cost. 

## Key takeaways

- Branch-Train-Merge (BTM) is a novel algorithm for training large language models (LLMs) in an embarrassingly parallel fashion. This eliminates the need for the typical, resource-intensive multi-node synchronization used in LLM training.
- BTM trains a set of specialized Expert Language Models (ELMs), each focused on a specific text domain. These ELMs can be dynamically added or removed to update the model's knowledge base. The ELMs are each independently functional LMs with **no shared parameters**.
- ELMFORESTs, trained with BTM, demonstrate superior performance and efficiency compared to traditional Transformer-based LLMs and a previous domain-specialized mixture of experts [(DEMIX)](https://aclanthology.org/2022.naacl-main.407/). This advantage is observed across various parameter scales and compute budgets.
- The effectiveness of ELMFORESTs arises from domain specialization, rather than simply increasing model parameters. **Ensembles of ELMs trained on random data splits do not perform as well, highlighting the importance of domain expertise**.
- ELMFORESTs offer flexible inference options: ensembling ELMs for optimal performance or averaging ELM parameters for efficient single-model inference. Both methods outperform traditional LLMs, with averaging approaching ensemble performance at a lower computational cost.
- A key element of BTM is the seed phase, where a single LM is trained on a heterogeneous corpus. This step is crucial for the success of ELM specialization and parameter averaging.
- The study demonstrates the successful scaling of ELMFORESTs to 64 domains, showing improved efficiency and comparable performance to a larger Transformer-LM trained with significantly more compute. This indicates the potential for BTM to democratize LLM development, enabling the creation of large, community-driven models with diverse expertise.

## Experiment

### Preliminary concepts

**Domain posterior**: A probability distribution estimating the likelihood of a sequence belonging to each domain. Used for ensembling ELMs and weighting parameter averages.

$$p(D = j | x<t)= \frac{p(x<t | D = j) \cdot p(D = j)}{p(x<t)} = \frac{p(x<t | D = j) \cdot p(D = j)}{\sum_{j'=1}^{k} p(x<t | D = j') \cdot p(D = j')}$$

where:
- $D$ is the domain variable
- $x<t$ represents the history
- $j$ is the domain label
- $k$ is the number of domains

**Hypothesis**: ELM performance is boosted by branching from pretrained LM parameters, since multi-phase adaptive pretraining is an effective way to develop domain-specific language models and parameter interpolation techniques work best with models that have a shared initialization.

### Objectives

- To demonstrate that ELMFORESTs, composed of domain-specialized ELMs, outperform traditional Transformer-based LLMs and previously proposed domain-specific models in terms of both performance and efficiency.
- To investigate the impact of various design choices in BTM, including the seed training phase, compute budget allocation, and choice of seed training corpus.
- To explore methods for combining ELMs at inference time, including ensembling and parameter averaging, and to analyze their performance and efficiency trade-offs.
- To showcase the scalability of ELMFORESTs by training a model on 64 domains, demonstrating its ability to achieve comparable performance to a larger Transformer-LM with significantly reduced computational cost.
### Setup

- Models: 
	- TRANSFORMER-LM (baseline): A standard Transformer LM trained using distributed data parallelism.
	- DEMIX: A domain-specialized MoE where feedforward layers in the Transformer are specialized as domain experts, while other parameters are synchronized.
	- ELMFOREST: A set of independently trained ELMs, each specializing in a distinct text domain.

- Datasets:
	- 8-domain corpus: Contains 8 training and 8 evaluation domains, covering a range of text types.
	- 80-domain corpus: Comprises 64 training and 16 evaluation domains, drawn from diverse data sources.

- Hyperparameters:
	- Model sizes: 125M, 350M, 750M, and 1.3B parameters.
	- Compute budgets: Varying number of updates to ensure consistent training time.
	- Learning rate: Fixed at 0.0005 with a polynomial decay schedule and 8% warmup.
	- Batch size: 16 per GPU, with gradient accumulation of 32 steps.
	- Precision: fp16.

- Metrics:
	- [[Perplexity]]: Used to evaluate the language modeling performance of the models.

- Branch-Train-Merge algorithm:
	- step 0 - initialization : 
	- step 1 - *Branch* : the best performing approach is a parameter weighted average of existing ELMs according to their domain posterior on the new data $d_{k+1}$.
	- step 2 - *Train* : train the new ELM $θ_{k+1}$ on data domain $d_{k+1}$ with the log likelihood objective.
	- step 3 - *Merge* : add the new ELM $θ_{k+1}$ to the existing set.
![](assets/branch_train_merge_1.png)
![](assets/branch_train_merge_2.png)

## Results

![](assets/branch_train_merge_3.png)
![](assets/branch_train_merge_0.png)
![](assets/branch_train_merge_4.png)
![](assets/branch_train_merge_5.png)
![](assets/branch_train_merge_6.png)
![](assets/branch_train_merge_7.png)