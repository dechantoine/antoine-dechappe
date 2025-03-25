---
title: "Imagine while reasoning in space: Multimodal Visualization-of-Thought"
draft: false
tags: 
paper: https://arxiv.org/pdf/2501.07542
code: 
date: 2025-03-21
---
## Abstract

This paper **addresses the challenge of complex spatial reasoning in Large Language Models (LLMs) and Multimodal Large Language Models (MLLMs)**, where Chain-of-Thought (CoT) prompting often falls short. To address this, the paper introduces **Multimodal Visualization-of-Thought (MVoT)**, a novel reasoning paradigm that enables visual thinking in MLLMs by generating image visualizations of reasoning traces. MVoT aims to enhance reasoning quality and model interpretability by allowing the model to "think" in both words and images, similar to human cognition.

![](assets/imagine_while_reasoning_0.png)

## Key takeaways

- MVoT enables MLLMs to **generate interleaved reasoning traces across different modalities**, facilitating visual thinking to visualize the reasoning traces.
- MVoT achieves **competitive performance across spatial reasoning tasks, outperforming traditional CoT**, particularly in challenging scenarios.
- The token discrepancy loss introduced in MVoT enhances visualization quality during reasoning by bridging the gap between separately trained tokenizers.
- MVoT demonstrates **better interpretability than CoT** by eliciting the reasoning process through visualizations, mitigating errors introduced by text-based captions.
- Combining MVoT with CoT offers complementary reasoning strategies, further enhancing performance.

## Experiment

### Preliminary concepts

**Token discrepancy loss** introduced in this paper aims to bridge the gap between separately trained tokenizer (texts and images) in auto-regressive MLLM:
>Let $N$ be the size of the dictionary of image tokenizer; we can obtain an embedding $e_{vis_{n}}$ for each token.
>
>Using those $N$ embeddings, we can compute their similarity matrix with MSE : 
>$$
>S = [MSE(e_{vis_{i}},e_{vis_{j}})]\forall (i,j) \in N
>$$
>Using the multimodal transformer to predict the next image token, we can compute the similarity of its embeddings with the embeddings of the vocabulary: 
>$$
>S_{t_{vis_{k}}} = [MSE(e_{vis_{k}},e_{vis_{i}})]\forall i \in N
>$$
>thus, $S_{t_{vis_{k}}} \in \mathbb{R}^N$.
>
>The model predicts the probability distribution $P(t_k) \in \mathbb{R}^N$ for the k-th image token over the image token vocabulary.
>
>Finally, we can penalize the model for assigning a high probability to an image token $t_k$ while its embeddings deviate significantly from the embeddings of the ground truth of this given token, by summing the dot product over all generated tokens: 
>$$
>\mathcal{L}_D=\sum_{i=1}^{n}S_{t_{vis_{i}}} \cdot P(t_i)
>$$
>
>During training, the image tokenizer and text tokenizer are kept frozen and the transformer is fine-tuned using the token discrepancy loss in addition to cross entropy for both text and image tokens.
	![[assets/imagine_while_reasoning_5.png]]

$\newline$
**MVot formulation**: 
>let $P_{θ}$ represent a pre-trained MLLM with parameters $θ$,
>
>$x$ a multimodal input sequence,
>
>$z$ a language sequence of verbal thoughts,
>
>$v$ an image sequence of visual thoughts,
>
>$\hat{z}_1,...,\hat{z}_m$ the intermediate steps of traditional CoT,
>
>MVoT enhances CoT by adding a image visualization $v_i$ to each intermediate step $z_i$ :
>$$
>\hat{v}_i{\sim}P_θ(v_i\mid\hat{z}_1,\hat{v}_1,...,\hat{v}_{i-1},\hat{z}_{i})
>$$
>$$
>\hat{z}_{i+1}{\sim}P_θ(z_{i+1}{\mid}x,\hat{z}_1,\hat{v}_1,...,\hat{z}_{i},\hat{v}_{i})
>$$

### Objectives

The primary objectives of the experiments are to:
- Evaluate the effectiveness of MVoT in dynamic spatial reasoning tasks compared to traditional CoT and direct prompting methods.
- Assess the impact of the token discrepancy loss on the quality of generated visual rationales.
- Demonstrate MVoT's adaptability and robustness across varying levels of complexity in spatial reasoning tasks.
- Investigate whether MVoT and CoT share similar reasoning capabilities by combining their predictions to calculate the upper-bound performance.

### Setup

- **Models**: 
	- The Anole-7B model, tuned on Chameleon, is used as the backbone. Anole can generate interleaved text and image, making it well-suited for MVoT.
	- GPT-4o *2024-07-01* for baseline.
	- ![](assets/imagine_while_reasoning_2.png)
- **Datasets**: The experiments are conducted on three dynamic spatial reasoning tasks: 
	- MAZE navigation 
	- MINIBEHAVIOR (InstallingAPrinter)
	- FROZENLAKE simulation
	![](assets/imagine_while_reasoning_1.png)
	![[assets/imagine_while_reasoning_3.png]]
- **Hyperparameters**: 
	- fine-tuned with LoRA on MI300X 
	- 40 epochs
	- optimizing only the loss from the predictions
- **Metrics**: 
	- the primary metric is accuracy, calculated by comparing the predicted choice with the ground-truth answer
	- Visualization Accuracy (V-Acc): Measures the accuracy of visualizing the intended modifications in the grid corresponding to the next action.
	- Visualization Pattern Redundancy (V-Red): Assesses the presence of unintended visual patterns in regions outside the targeted area of modification.
	- Visualization Correctness Step (V-Steps): the average length of first k consecutive correct visualizations within an action sequence.
	- Visualization Correctness Ratio (V-Ratio): the average proportion of first k consecutive correct visualizations across the action sequence.
- **Baselines**:
	- Direct Prompting (*Direct*): The model directly outputs the choice index without intermediate reasoning.
	- Chain-of-Thought (*CoT*): The model is instruction-tuned to reason step-by-step, incorporating coordinates and environment layout described in text, before concluding with the final answer. 
	- Training with Interleaved Text-Image Pairs (*Interleaved*): This method follows the standard training approach for MLLMs, interleaving text and image data.

- Input augmentation is applied during MVoT training to improve visualization robustness and mitigate noise introduced by image reconstruction during tokenization and detokenization. This augmentation applies tokenization and detokenization over the input image for multiple times, with the iteration count randomly determined between 0 and 10.

## Results

![[assets/imagine_while_reasoning_4.png]]
![[assets/imagine_while_reasoning_7.png]]
![[assets/imagine_while_reasoning_6.png]]
![[assets/imagine_while_reasoning_8.png]]

## Discussions

- During training, the model generates the next visual thought based on the previous golden image. On the other hand, during inference it recursively generates multimodal thoughts (texts and image visualizations) based on the previously generated thoughts.
- Equip Proprietary Models with MVoT: MVoT also provides flexibility of being used as plug-ins for other proprietary models including those accessible via APIs. The authors provide GPT-4o with the visual thoughts from fine-tuned MVoT model after GPT-4o generates the verbal thought. It led to a 15% improvement in accuracy performance across all the tasks.

## Appendix

![[imagine_while_reasoning_9.png]]
![[assets/imagine_while_reasoning_10.png]]