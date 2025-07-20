---
title: Layer Normalization
draft: false
paper: https://arxiv.org/pdf/1607.06450
date: 2025-07-20
---
## Definition

**Layer Normalization** standardize the inputs to a layer for each training example. It helps to stabilize the learning process and can significantly speed up the training of deep learning models.
In essence, for a given neuron in a layer, **Layer Normalization** computes the mean and variance of all the inputs to that neuron for a _single_ data sample in the batch. It then uses this mean and variance to normalize the input to that neuron.

In practise, **Layer Normalization** is applied at layers outputs level, so all the hidden units in a layer share the same normalization terms $µ$ and $σ$, but different training cases have different normalization terms.`
It also comes with two learnable parameters, $γ$ and $β$, which respectively rescaled and shift the standardized distribution of inputs to give the network more flexibility.

This is in contrast to **Batch Normalization**, which calculates the mean and variance across all the data samples in a batch for a given layer.
## Formula

Let consider a layer outputs $X$ of shape `(batch_size, input_sample_shape)`where `input_sample_shape`can be an arbitrary dimension (a 3 dimensional image for example)

then the Layer Normalization of outputs of this layer is:

$$
Y=\frac{X-µ(X)}{\sqrt{σ(X)^2+ε}}*γ+β
$$
let's break this formula step-by-step:
- $µ(X)$ is the mean of $X$ over the `input_sample_shape`
- $σ(X)$ is the standard deviation of $X$ over the `input_sample_shape`
- $ε$ is a residual added to avoid division by zero
- $γ$ and $β$ are respectively a learnable scale factor and a learnable bias of dimension `input_sample_shape`. Those learnable parameters are optional and their efficiency is still discussed.

## Example

Let's consider two connected hidden layer inside a neural network. The nature of the two layers can be diverse (Feed-Forward, Activation function, Convolutional, ...). For a given sample, the first layer outputs a vector of 4 values:
$$X = [2, 4, 6, 8]$$
If we introduce a Layer Normalization between the two layers, here is how it would work:

**1. Calculate the mean $µ$**

$$\begin{align}
µ(X) & =\frac{2+4+6+8}{4}\notag\\
& = 5\notag\\
\end{align}
$$

**2. Calculate the standard deviation $σ$**

$$\begin{align}
σ(X) & =\sqrt{\frac{(2-µ)^2+(4-µ)^2+(6-µ)^2+(8-µ)^2}{4}}\notag\\
& = \sqrt{\frac{9+1+1+9}{4}}\notag\\
& = \sqrt{5}\notag\\
& ≈ 2.236\notag\\
\end{align}
$$

**3. Standardize the outputs**

Now, we normalize each value in the output vector using the formula:
$$
Normalized(x_i)=\frac{x_i-µ}{\sqrt{σ^2+ε}}
$$
Let's take $ε=0$ for the sake of this example, because we know that $σ≠0$. Then,

$$
\begin{align}
Normalized(x_1) & =\frac{2-5}{\sqrt{5}}≈-1.341\notag\\
Normalized(x_2) & =\frac{4-5}{\sqrt{5}}≈-0.447\notag\\
Normalized(x_3) & =\frac{6-5}{\sqrt{5}}≈0.447\notag\\
Normalized(x_4)& =\frac{8-5}{\sqrt{5}}≈1.341\notag\\
\end{align}
$$


**4. Scale and shift the outputs (optional but common)**

Let's assume for this example that $γ = 1.5$ and $β = 0.5$. The final output of the Layer Normalization is calculated as:

$$
y_i=γ*Normalized(x_i)+β
$$
Then,

$$
\begin{align}
y_1 & =1.5*Normalized(x_1)+0.5 ≈-1.5115\notag\\
y_2 & =1.5*Normalized(x_2)+0.5 ≈-0.1705\notag\\
y_3 & =1.5*Normalized(x_3)+0.5 ≈1.1705\notag\\
y_4 & =1.5*Normalized(x_4)+0.5 ≈2.5115\notag\\
\end{align}
$$
The final output layer from the Layer Normalization is $Y=LayerNormalization(X)=[-1.5115,-0.1705,1.1705,2.5115]$. This vector is then passed to each neuron of the next layer.

## Usage

- When using both Layer Normalization and Dropout in a neural network, the generally recommended order is to apply **Layer Normalization first, followed by Dropout**.
- The standard architectural block you'll see in many modern neural networks follows this order: `Linear Layer -> Layer Normalization -> Activation Layer`. The main goal of this order is to control the statistics of the signals passed between layers. By normalizing **before** the activation function, you ensure the inputs land in a "healthy" range for the activation (think about saturation in `tanh` or `sigmoid` which led to vanishing gradients).
- It's worth noting that the original Transformer paper ("Attention Is All You Need") used a **"post-normalization"** architecture, where Layer Normalization was applied _after_ the residual connection, which includes the activation function: `LayerNormalization(x + Sublayer(x))`.