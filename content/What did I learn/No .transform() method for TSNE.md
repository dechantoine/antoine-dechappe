---
title: No .transform() method for TSNE
tags:
  - t-sne
  - visualization
sources:
  - https://opentsne.readthedocs.io/en/stable/tsne_algorithm.html#t-sne
  - https://stackoverflow.com/questions/59214232/python-tsne-transform-does-not-exist
date: 2024-03-14
---
# Description

It is actually not possible to learn a transformation and reuse it on different data, as t-SNE does not learn a mapping function on a lower dimensional space, but rather runs an iterative procedure on a subspace to find an equilibrium that minimizes a loss/distance on a data set X ∈ ℝ<sup>D</sup>.
