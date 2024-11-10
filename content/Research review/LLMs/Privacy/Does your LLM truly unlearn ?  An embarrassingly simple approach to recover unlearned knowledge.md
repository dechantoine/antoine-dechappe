---
title: Does your LLM truly unlearn ?  An embarrassingly simple approach to recover unlearned knowledge
draft: false
tags:
---

Link: https://arxiv.org/pdf/2410.16454
Code: https://github.com/zzwjames/FailureLLMUnlearning

Keywords: 

## Abstract

LLMs may acquire unwanted behaviors from the diverse and sensitive nature of their training data, which can include copyrighted and private content. Machine unlearning has been introduced as a viable solution to remove the influence of such problematic content without the need for costly and time-consuming retraining. This process aims to erase specific knowledge from LLMs while preserving as much model utility as possible. Despite the effectiveness of current unlearning methods, little attention has been given to whether existing unlearning methods for LLMs truly achieve forgetting or merely hide the knowledge, which current unlearning benchmarks fail to detect. This paper reveals that applying quantization to models that have undergone unlearning can restore the "forgotten" information. We conduct comprehensive experiments using various quantization techniques across multiple precision levels to thoroughly evaluate this phenomenon. Based on our empirical findings, we provide a theoretical explanation for the observed phenomenon and propose a quantization-robust unlearning strategy aimed at mitigating this intricate issue. 

## Key takeaways

- Among the advanced unlearning methods, [Gradient Ascent (GA)](https://arxiv.org/abs/2310.10683)  and [Negative Preference Optimization (NPO)](https://arxiv.org/abs/2404.05868) are the most foundational :
	- GA aims to minimize the likelihood of making correct predictions on a forget dataset by applying gradient ascent to the cross-entropy loss. 
	- NPO treats the forget set as negative preference data, adapting the offline DPO objective to adjust the model to assign a lower likelihood to the forget set.
	- Techniques such as Gradient Descent on the Retain dataset and minimizing the KL Divergence between the unlearned model’s and the target model’s probability distributions on inputs from the retain dataset are introduced to preserve the utility of the unlearned model.
- For unlearning methods with utility constraints, the unlearned **model retains an average of 21% of the intended forgotten knowledge** in full precision, which significantly **increases to 83% after 4-bit quantization**. 
- There is a fundamental tension between preserving the utility of the unlearned model and preventing knowledge recovery through quantization
- Key hypothesis is that because existing methods typically adopt a small learning rate and regularization on the retain set, the model weights of the target LLM and the unlearned LLM are very close. Hence, quantization is likely to map the weights of the target LLM and the unlearned LLM to the same values.
- Authors propose a framework called Saliency-Based Unlearning with a Large Learning Rate (SURE). SURE aims to mitigate the knowledge recovery issue by selectively updating the most influential components of the LLM related to the data to be forgotten. This is achieved by constructing a module-level saliency map based on the gradient of the forgetting loss. Experiments show that SURE effectively prevents knowledge recovery through quantization while maintaining model utility.

## Experiment

### Preliminary 

**Commonly used formulation for optimizing model unlearning:**

$$min_θ \Bigl[ E(x_f,y_f∈D_{forget}) [L_{forget}(y_f | x_f ; θ)] + α ⋅ E(x_r,y_r∈D_{retain}) [L_{retain}(y_r | x_r ; θ)] \Bigr]$$

where : 

- $D_{retain} = D_{train} \setminus D_{forget}$
- $L_{forget}$ is a loss function designed to penalize the model for retaining information about the forget set
- $L_{retain}$ ensures that utility is preserved on the retain dataset
- $α$ is a regularization parameter to balance the two losses.

**Quantization for a group of weights:**

$$Q(w)=∆ · Round (\frac{w}{∆}), ∆=\frac{max(|w|)}{2^{N−1}}$$

where:
- $N$ is the number of quantization bits
- $∆$ is the quantization scale factor

[**Generative Pretrained Transformers Quantization (GPTQ)**](https://arxiv.org/pdf/2210.17323)

One-shot weight quantization method based on approximate second-order information.
![[assets/does_your_llm_truly_unlearn/does_your_llm_truly_unlearn_3.png]]

[**Activation-aware Weight Quantization (AWQ)**](https://arxiv.org/pdf/2306.00978)

Doesn’t quantize all the weights in a model, and instead, it preserves a small percentage of weights that are important for LLM performance. This significantly reduces quantization loss such that you can run models in 4-bit precision without experiencing any performance degradation.
![[assets/does_your_llm_truly_unlearn/does_your_llm_truly_unlearn_4.png]]

**Min-K% method**

![[assets/does_your_llm_truly_unlearn/does_your_llm_truly_unlearn_5.png]]

### Objectives

 - To what extent does quantization affect the LLM unlearning performance? 
 - What effect does quantization precision have on unlearning? 
 - How do different quantization techniques affect unlearning?

### Settings

- Unlearning methods : combining two primary families of unlearning algorithms (NPO & GA) with two strategies for utility preservation (GDR & KLR), resulting in six approaches : GA, GA_GDR, GA_KLR, NPO, NPO_GDR, and NPO_KLR.
- Datasets extracted from MUSE benchmark :
	- **NEWS** : focus on recent BBC articles divided into forget, retain, and holdout sets
	- **BOOKS** : focus on Harry Potter series with original novels as the forget set and related FanWiki materials as the retain set
- Metrics : 
	- _(M1)_ No verbatim memorization : **VerMem**, which evaluates verbatim memorization by comparing model continuation outputs to actual tokens using the ROUGE score.
	- _(M2)_ No knowledge memorization : **KnowMem** on $D_{forget}$ which measures knowledge memorization by analyzing responses to tailored knowledge QA pairs
	- _(M3)_ No privacy leakage : **PrivLeak** which assesses privacy preservation using the Min-K% method
	- _(M4)_ Utility preservation : **KnowMem** on $D_{retain}$
- Quantization : 4-bits and 8-bits with round-to-nearest (RTN), GPTQ and AWQ.

## Results

![[assets/does_your_llm_truly_unlearn/does_your_llm_truly_unlearn_1.png]]

![[assets/does_your_llm_truly_unlearn/does_your_llm_truly_unlearn_2.png]]