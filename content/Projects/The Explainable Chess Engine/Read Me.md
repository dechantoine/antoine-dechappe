---
title: ReadMe
draft: false
tags:
---
<!-- PROJECT LOGO -->
<div align="center">
  <a>
    <img src="/assets/xplainable.png" alt="Logo" width="180" height="180">
  </a>

  <h3 align="center">Explainable Chess Engine</h3>

  <p align="center">
    A minimalist DL chess engine with explainability.
    <br />
    <br />
    <a href="https://huggingface.co/spaces/dechantoine/explainable-chess-engine">View Demo</a>
    ·
    <a href="https://github.com/dechantoine/explainable-chess-engine">Repository</a>
    ·
    <a href="https://github.com/dechantoine/explainable-chess-engine">Report Bug</a>
    ·
    <a href="https://github.com/dechantoine/explainable-chess-engine">Request Feature</a>
  </p>
</div>

# About The Project

This project aim to build a minimalist Deep Learning chess engine with explainability.
The goal is to create a chess engine that can explain its decisions in a human-readable way.
This project will be a great way to learn about chess engines, deep learning, and explainability in AI.

## Objectives

- Build a Deep Learning framework optimized for training with chess data.
- Monitor the performance of the training framework to optimize training time, CPU/GPU usage, and memory usage.
- Demonstrate proficiency in PyTorch, Tensorflow, Keras and Jax.
- Build the best model with the minimal number of parameters for several ELO levels.
- Create a human-readable explanation of the model's decisions.
- Implement a chess engine that can play against human or AI players using the model.

## Roadmap

- [x] Create the project structure
- [x] Pytorch Framework
  - [x] Custom pytorch dataset for chess data
    - [x] Read any board state at any game number in a PGN file
    - [x] Convert board, moves and game result to tensor
    - [x] Batch all operations
    - [x] Tests
  - [x] Training loop & utilities for training
    - [x] Training loop
    - [x] Logging & Tensorboard
    - [x] Evaluation
    - [x] Save & Load model
    - [x] Tests for training framework
- [ ] Tensorflow Framework
  - [ ] Custom TFRecords for chess data
    - [ ] Read any board state at any game number in a PGN file
    - [ ] Convert board, moves and game result to tensor
    - [ ] Batch all operations
    - [ ] Tests
- [x] Chess Engine
  - [x] Beam Search using the DL models
  - [x] Implement matches
  - [x] Evaluate against Stockfish
  - [x] Tests for the chess engine
- [ ] Explainability
  - [x] Beam Search visualization
  - [x] Board evaluation visualization
- [ ] Deployment
  - [ ] Dockerize the project
  - [ ] Deploy on Lichess
  - [x] Deploy on HuggingFace

# Demo

<iframe
	src="https://dechantoine-explainable-chess-engine.hf.space"
	frameborder="0"
	width="850"
	height="700"
></iframe> 
