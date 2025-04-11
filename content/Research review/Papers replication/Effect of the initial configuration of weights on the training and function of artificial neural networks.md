---
title: Effect of the initial configuration of weights on the training and function of artificial neural networks
draft: true
tags: 
originalPaper: https://antoine-does-ai.com/Research-review/Deep-Learning/Effect-of-the-initial-configuration-of-weights-on-the-training-and-function-of-artificial-neural-networks
replicationCode: https://github.com/dechantoine/deep-learning-papers/blob/main/effect_of_initial_configuration_of_weights/src/demo.ipynb
date: 2025-03-08
---
# Original Paper

## Objectives

- Characterize how much the weights of a neural network deviate from their initial random configuration during training.
- Explore the relationship between the initial configuration of weights and the success of the training process.
- Investigate the phenomenon of a neural network crossing over between regimes of trainability and untrainability.
- Explore the connection between network trainability and the distance a network travels from its initial configuration of weights.

## Setup

- Feedforward neural networks : 2 ReLU(hidden layers), each containing 10 to 1000 units + output layer using softmax. _This architecture is similar to a Keras-created multilayer perceptron for MNIST._
- Glorot initialization.
- 3 datasets: MNIST, Fashion MNIST, and HASYv2.
- Loss : categorical cross-entropy
- SGD (learning_rate = 0.1, batch_size=128)
- to illustrate the reduced scale of the deviations of weights during the training, network’s initial configuration of weights has been marked using a mask in the shape of a letter.

## Findings

- Peak of distribution of final values of weights extremely close to the median
- Skewness of distribution for large absolute values $\newline$![[assets/effect_of_initial_configuration_3.png]]

# My experiments

## Warmup

The masked weights plot in the original paper looks fun so I would like to see it dynamically. 
### Objectives

- [x] Reproduce paper mask to illustrate the reduced scale of the deviations of weights during the training (GIF).
- [x] Reproduce the distribution of values of the weights as function of initial values, for each epoch (GIF).
### Setup

- Initialization : Glorot uniform for all layers
- Datasets : MNIST
- Hidden layers size : 256
- Optimizers: SGD
- Batch size : 128
### Findings

Proof of concept with hidden layer size = 256 and masked weights

 ![](assets/masked_weights.gif)

Proof of concept with hidden layer size = 128 and distribution of weights against initial distribution

 ![](assets/weights_distribution.gif)

In the followings experiments, I will keep the plotting configuration above: x-axis will be hidden weights distribution at epoch 0, y-axis will be hidden weights distribution at epoch *i*.

## Experiment 1 : persistence of results with regards to initialization

Let's find out if the weights of the hidden layer stay in the neighborhood of their initial value for different experiment variations.
We will change the initialization of the hidden layer weights, using both Glorot uniform and normal to introduce another distribution shape, and He uniform and normal to test a different scale.
To measure the skewness of the distribution for large absolute value, we will compare the co
## Objectives

- [x] Reproduce the distribution of values of the weights as function of initial values, with different hidden layer size.
- [x] Reproduce the distribution of values of the weights as function of initial values, with different initialization methods.
### Setup

- Initialization : Glorot uniform, Glorot normal, He uniform, He normal
- Datasets : MNIST
- Hidden layers size : 64, 128, 256
- Optimizers: SGD
- Batch size : 128
### Findings

Distribution of weights against initial distribution with different hidden layer sizes - Glorot uniform, He uniform, Glorot normal, He normal - MNIST - SGD
 ![](assets/distribution_multi_init.gif)

Coefficient of correlation *r* between hidden weights values at epoch 0 and hidden weights values at epoch *i*:

| hidden weights | epochs | Glorot uniform | He uniform | Glorot normal | He normal |
| :------------- | :----- | :------------- | :--------- | :------------ | :-------- |
| 64             | 1      | 0.983          | 0.995      | 0.982         | 0.993     |
|                | 2      | 0.974          | 0.992      | 0.971         | 0.989     |
|                | 5      | 0.961          | 0.986      | 0.956         | 0.982     |
|                | 10     | 0.949          | 0.977      | 0.940         | 0.975     |
|                | 20     | 0.933          | 0.963      | 0.915         | 0.964     |
|                | 50     | 0.895          | 0.938      | 0.871         | 0.938     |
| 128            | 1      | 0.988          | 0.996      | 0.987         | 0.995     |
|                | 2      | 0.984          | 0.994      | 0.980         | 0.992     |
|                | 5      | 0.973          | 0.991      | 0.968         | 0.988     |
|                | 10     | 0.963          | 0.988      | 0.954         | 0.982     |
|                | 20     | 0.946          | 0.980      | 0.935         | 0.974     |
|                | 50     | 0.903          | 0.958      | 0.898         | 0.956     |
| 256            | 1      | 0.992          | 0.997      | 0.993         | 0.997     |
|                | 2      | 0.989          | 0.996      | 0.989         | 0.995     |
|                | 5      | 0.980          | 0.994      | 0.980         | 0.993     |
|                | 10     | 0.971          | 0.991      | 0.972         | 0.989     |
|                | 20     | 0.959          | 0.987      | 0.959         | 0.984     |
|                | 50     | 0.934          | 0.974      | 0.935         | 0.973     |
