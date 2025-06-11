---
title: pass^k
draft: false
paper: 
date: 2025-06-11
---
## Definition

$pass^k$ measures the probability of a model generating a correct solution in all of its $k$ independent attempts. Unlike [[pass@k]], which checks for at least one correct solution, $pass^k$ demands consistent correctness across all $k$ samples. It serves as a measure of a model's reliability.

## Formula

let $D = \{q_i, a_i\}_{i=1}^{i=m}$ be a test dataset 
- of size $m$, 
- with questions $𝑞_𝑖$,
- and answers $a_i$,

let $D_G = \{q_i, \{\hat{a}_{ij}\}^{j=n}_{j=1}\}_{i=1}^{i=m}$ be a dataset of independently generated answers where 
- $n$ is the number of generated answers per question, 
- $\hat{a}_{ij}$ is the model’s 𝑗-th final answer for $q_i$,
- $c_i$ is the number of correct solutions for $q_i$ in $\{\hat{a}_{ij}\}^{j=n}_{j=1}$

then
$$
pass^k = \mathbb{E}_{D_G} \left(\frac{c}{n}\right)^k
$$

let's break this formula step-by-step:
- $\frac{c}{n}$ computes the probability that a single, randomly chosen sample is correct
- $(.)^k$ computes the probability of this event occurring consecutively $k$ times.
## Example

Let's get through a simple example of a dataset of size $m = 1$. **For a real dataset, all individual $pass^k$ values are averaged across all samples.**

A language model is tasked with writing a Python function to check if a number is prime. We generate **200** code samples ($n = 200$). After running unit tests, we find that **10** of them are correct ($c = 10$).

The probability of any single sample being correct is $p_{correct}=\frac{10}{200}=0.05$.

Now, let's calculate $pass^1$, $pass^5$, and $pass^{10}$.

**Calculating $pass^1$:**

This tells us the probability that a single, randomly chosen sample is correct.

Using the formula: 
$$\begin{align}
pass^1 & = (\frac{10}{200})^1\notag\\
& = 0.05\notag\\
\end{align}
$$

So, there is a **5%** chance that the first generated sample is correct. This is identical to $pass@1$.

**Calculating $pass^5$:**

This is the probability that all 5 of the first 5 samples are correct.

Using the formula: 

$$\begin{align}
pass^5 & =(\frac{10}{200})^5\notag\\
& = (0.05)^5\notag\\
& = 3.125\times 10^{-7}\notag\\
\end{align}
$$

This means there is an extremely small (approximately 0.00003%) chance that all 5 of the first 5 generated samples would be correct.

**Calculating $pass^{10}$:**

This is the probability that all 10 of the first 10 samples are correct.

The calculation continues in the same manner:

$$\begin{align}
pass^{10} & =(\frac{10}{200})^{10}\notag\\
& = (0.05)^{10}\notag\\
& = 9.765625\times 10^{-14}\notag\\
\end{align}
$$

The resulting value is astronomically small, highlighting the metric's strictness.

## Usage

- $pass^k$ is a measure of a model's reliability and consistency. A high $pass^k$ score (for $k>1$) would indicate an exceptionally robust model that is correct with high frequency.
- $pass^k$ is the conceptual opposite of [[pass@k]]. While [[pass@k]] values increase toward 1.0 as $k$ grows, $pass^k$ values decrease exponentially, quickly approaching zero. 
- $pass^k$ could be valuable for safety-critical or high-stakes applications where every output in a batch must be correct. For instance, if a model were used to automatically patch a security vulnerability across thousands of codebases, a single failure could be catastrophic.