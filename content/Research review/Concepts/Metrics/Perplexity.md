---
title: Perplexity
draft: false
paper: 
date: 2025-06-12
---
## Definition

**Perplexity** is one of the most common metrics for evaluating autoregressive language models. It is a measure of how well a probability model predicts a sample. 

## Formula

Let $\theta$ be the parameters of an autoregressive model. If we have a tokenized sequence 

$$
X=(x_0,x_1,…,x_t)
$$

then the perplexity of $X$regarding to $\theta$ is :

$$
\text{PPL}(X) = \exp \Bigl\{ \frac{1}{t}\sum_{i=1}^t -\log p_\theta (x_i|x_{<i}) \Bigl\}
$$

let's break this formula step-by-step:
- $p_{\theta} (x_i|x_{<i})$ is the likelihood of the ith token conditioned on the preceding tokens $x_{<i}$according to our model
- $-\log (.)$ is the negative log of this likelihood
- $\frac{1}{t}\sum_{i=1}^t(.)$ computes the average of the negative log-likelihood
- $\exp \Bigl\{.\Bigl\}$ computes the exponential of the average.

*Note: The base of the logarithm and the exponentiation must match. While the natural logarithm ($ln$, base $e$) is common, perplexity is often reported using base 2.*
## Example

Let's calculate the perplexity for a short sentence given the output probabilities from an hypothetical autoregressive model.

- **Vocabulary**: {*"the"*, *"cat"*, "*couch*", *"sat"*, *"on"*} (plus a *\<start>* token)
- **Test Sequence (W)**: ("*the*", "*cat*", "*sat*")
- **Sequence Length (T)**: 3

Our model will process this sequence one token at a time and give us a probability for the _correct_ next token.

**Step 1: First token, "_the_"**

- Context: *\<start>*
- Model predicts the probability for each word in the vocabulary. Let's say it outputs:
    - $p(\text{"the"} | \text{})=0.6$
    - $p(\text{"cat"} | \text{})=0.05$
    - $p(\text{"couch"} | \text{})=0.1$
    - $p(\text{"sat"} | \text{})=0.15$
    - $p(\text{"on"} | \text{})=0.1$

We only care about the probability of the **actual** token, which is **0.6**.

**Step 2: Second token, "_cat_"**

- Context: *"the"*
- Model predicts the probability for the next word given "the":
    - $p(\text{"the"} | \text{"the"})=0.01$
    - $p(\text{"cat"} | \text{"the"})=0.5$
    - $p(\text{"couch"} | \text{"the"})=0.4$
    - $p(\text{"sat"} | \text{"the"})=0.04$
    - $p(\text{"on"} | \text{"the"})=0.05$

The probability of the **actual** token is **0.5**.

**Step 3: Third token, "_sat_"**

- Context: "_the_", "_cat_"
- Model predicts the probability for the next word given "the cat":
    - $p(\text{"the cat"} | \text{"the"})=0.05$
    - $p(\text{"cat"} | \text{"the cat"})=0.2$
    - $p(\text{"couch"} | \text{"the cat"})=0.05$
    - $p(\text{"sat"} | \text{"the cat"})=0.4$
    - $p(\text{"on"} | \text{"the cat"})=0.3$

The probability of the **actual** token is **0.4**.

**Step 4: Calculation**

Now we have the probabilities for the correct tokens at each step: _[0.6, 0.5, 0.4]_. Let's plug them into the formula using base 2.

1. **Calculate the log probabilities**:
    - $log_2(0.6)≈−0.737$
    - $log_2(0.5)=−1.0$
    - $log_2(0.4)≈−1.322$
2. **Calculate the average negative log-likelihood (the cross-entropy)**: 

$$
\begin{align}
H(X) & =\frac{1}{t}\sum_{i=1}^t -\log p_\theta (x_i|x_{<i})\notag\\
 & =\frac{1}{3}(0.737+1.0+1.322)\notag\\
 & =\frac{1}{3}(3.059)\notag\\
& ≈1.02\notag\\
\end{align}
$$

3. **Calculate the perplexity by exponentiating**: 

$$
\begin{align}
PPL(X) & =2^{H(W)}\notag\\
&=2^{1.02}\notag\\
&≈2.029
\end{align}
$$

**Conclusion**

The perplexity of the sequence "the cat sat" for our model is approximately **2.03**.

## Usage

- The higher the likelihood of a the correct next token, the lesser its negative log-likelihood; inversely, an unexpected correct token with a very small likelihood will have a considerable impact on the average of the log-likelihoods and hence on the perplexity.
- While a lower perplexity is always better, there is no universal "good" perplexity score. A PPL of 50 might be state-of-the-art for a complex domain like legal or scientific text, while a PPL of 50 for a simple domain like children's stories would be considered very poor.
- perplexity is a good proxy for language understanding, but it's not the same as performance on a downstream task like summarization, translation, or question answering.
- Perplexity scores are only comparable if the underlying conditions are identical. This means:
	- Same Test Set: You must use the exact same test data.
	- Same Tokenization: The way you split text into tokens (e.g., WordPiece, BPE) must be identical. A different tokenizer creates a different vocabulary and sequence length, making PPL scores incomparable.

## Additional readings

https://thegradient.pub/understanding-evaluation-metrics-for-language-models/