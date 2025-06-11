---
title: maj@k
draft: false
paper: 
date: 2025-06-11
---
## Definition

**maj@k** measures the performance of a model based on a majority vote. For each problem, k solutions are generated. The most frequent solution is identified, and it is marked as correct if it passes the problem's tests. The final $maj@k$ score is the percentage of problems for which the most frequent solution was correct.
$maj@k$ assesses the model's ability to produce a consistent and correct answer.

## Formula

let $D = \{q_i, a_i\}_{i=1}^{i=m}$ be a test dataset 
- of size $m$, 
- with questions $𝑞_𝑖$,
- and answers $a_i$,

let $D_G = \{q_i, \{\hat{a}_{ij}\}^{j=n}_{j=1}\}_{i=1}^{i=m}$ be a dataset of independently generated answers where 
- $n$ is the number of generated answers per question, 
- $\hat{a}_{ij}$ is the model’s 𝑗-th final answer for $q_i$,
- $c_i$ is the number of correct solutions for $q_i$ in $\{\hat{a}_{ij}\}^{j=n}_{j=1}$

then, for a single question $q_i​$, the most frequent answer, or mode, is: 

$$
\hat{a}_{i,maj​}=mode(\{{\hat{a}_{ij}\}^{j=k}_{j=1}})
$$

If there is a tie for the most frequent answer, one is selected at random.

We then define $is\_correct(\hat{a}_{i,maj​})$,  an indicator function equals to 1 if the majority-voted answer $\hat{a}_{i,maj​}$ is correct, and 0 otherwise.

The overall $maj@k$ metric is the average correctness of these majority-voted answers over the entire dataset: 

$$
maj@k = \frac{1}{m}\sum_{i=1}^{m}{is\_correct(\hat{a}_{i,maj​})}
$$
## Example

Let's get through a simple example of a dataset of size $m = 3$.

Imagine a language model is tasked with solving mathematical equations. To evaluate its performance on this task, we generate $k=5$ answers per equation.

For the first equation, the result are as follows:
- Answer $a_1$ (incorrect)
- Answer $b_1$ (correct)
- Answer $b_1$ (correct)
- Answer $b_1$ (correct)
- Answer $c_1$ (incorrect)

Then $\hat{a}_{i,maj​}=b_1$. 

For the second equation, the result are as follows:
- Answer $a_2$ (incorrect)
- Answer $b_2$ (incorrect)
- Answer $b_2$ (incorrect)
- Answer $a_2$ (incorrect)
- Answer $c_2$ (correct)

Let's break tie by selecting at random: $\hat{a}_{i,maj​}=a_2$. 

For the third equation, the result are as follows:
- Answer $a_3$ (incorrect)
- Answer $b_3$ (incorrect)
- Answer $c_3$ (correct)
- Answer $c_3$ (correct)
- Answer $c_3$ (correct)

Then $\hat{a}_{i,maj​}=c_3$.

Since $b_1$ and $c_3$ are correct in our exemple, and $a_2$ is not:

$$
\begin{align}
maj@k & = \frac{1}{3}(1+0+1)\notag\\
    &= \frac{2}{3}\notag\\
\end{align}
$$

## Usage

- $maj@k$ measures the model's reliability in producing a correct answer as its most frequent suggestion. A high $maj@k$ score suggests that the model is not just getting lucky with one of its generations, but is consistently producing the correct solution.
- $maj@k$ is robust to occasional, non-recurring errors. A single anomalous incorrect answer will not affect the outcome as long as the correct answer holds the majority.
- $maj@k$ is a good sweet spot between [pass@k](https://antoine-does-ai.com/Research-review/Concepts/Metrics/pass_at_k) and  [pass^k](https://antoine-does-ai.com/Research-review/Concepts/Metrics/pass_power_k), with the former being too generous in its scoring (is there at least one good answer ?) and the later too rigorous (are all the answer correct ?).