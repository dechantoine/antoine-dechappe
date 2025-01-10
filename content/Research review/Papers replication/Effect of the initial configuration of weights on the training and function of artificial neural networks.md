---
title: Effect of the initial configuration of weights on the training and function of artificial neural networks
draft: true
tags: 
originalPaper: obsidian://open?vault=antoine-dechappe&file=content%2FResearch%20review%2FDeep%20Learning%2FEffect%20of%20the%20initial%20configuration%20of%20weights%20on%20the%20training%20and%20function%20of%20artificial%20neural%20networks
replicationCode: https://github.com/dechantoine/deep-learning-papers/blob/main/effect_of_initial_configuration_of_weights/src/demo.ipynb
---
# Original Paper

## Objectives

- Characterize how much the weights of a neural network deviate from their initial random configuration during training.
- Explore the relationship between the initial configuration of weights and the success of the training process.
- Investigate the phenomenon of a neural network crossing over between regimes of trainability and untrainability.
-  Explore the connection between network trainability and the distance a network travels from its initial configuration of weights.

## Setup

- Feedforward neural networks : 2 ReLU(hidden layers), each containing 10 to 1000 units + output layer using softmax. _This architecture is similar to a Keras-created multilayer perceptron for MNIST._
- Glorot initialization.
- 3 datasets: MNIST, Fashion MNIST, and HASYv2.
- Loss : categorical cross-entropy
- SGD (learning_rate = 0.1, batch_size=128)
- to illustrate the reduced scale of the deviations of weights during the training, network’s initial configuration of weights has been marked using a mask in the shape of a letter.

## Findings

- Peak of distribution of final values of weights extremely close to the median
- Skewness of distribution for large absolute values
![[assets/effect_of_initial_configuration_3.png]]

# My replication

## Objectives

- [x] Reproduce paper mask to illustrate the reduced scale of the deviations of weights during the training (GIF).
- [x] Reproduce the distribution of values of the weights as function of initial values, for each epoch (GIF).
- [ ] Reproduce the distribution of values of the weights as function of initial values, with different hidden layer size.
- [ ] Reproduce the distribution of values of the weights as function of initial values, with different optimizer.
## Setup

- Initialization : Glorot
- Datasets : MNIST
- Hidden layers size : 8, 16, 32, 64, 128, 256
- Optimizers: SGD, Adam

## Findings

### Proof of concept with hidden layer size = 256 and masked weights

![](content/assets/masked_weights.gif)

### Proof of concept with hidden layer size = 256 and distribution of weights against initial distribution

![](content/assets/weights_distribution.gif)

### Distribution of weights against initial distribution with different hidden layer sizes

![](content/assets/distribution_multi.gif)