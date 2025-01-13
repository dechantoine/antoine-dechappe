---
title: Mel spectrograms
tags:
  - audio
  - music
  - signal-processing
  - data-transformation
  - computer-vision
sources:
  - https://en.wikipedia.org/wiki/Mel_scale
  - https://arxiv.org/abs/1706.07156
date: 2024-05-06
---
# Description

The mel scale is a perceptual scale of pitches judged by listeners to be equal in distance from one another.

A Mel Spectrogram makes two important changes relative to a regular spectrogram that plots Frequency vs Time.
- it uses the mel scale instead of Frequency on the y-axis.
- it uses the decibel scale instead of Amplitude to indicate colors.

The spectrograms can then be processed with SOTA computer vision models.

# Example

![](assets/mel_spectrogram.png)