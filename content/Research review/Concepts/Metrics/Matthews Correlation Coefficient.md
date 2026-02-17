---
title: Matthews Correlation Coefficient
draft: false
paper:
date: 2026-02-06
---
## Definition

The **Matthews Correlation Coefficient (MCC)** is a statistic used to evaluate the quality of binary classifications. It measures the correlation between the observed and predicted classifications, resulting in a value between -1 and +1. Unlike accuracy or the F1-score, MCC is a **balanced measure** that remains reliable even when classes are of significantly different sizes because it considers all four cells of the confusion matrix.

## Formula

The MCC is calculated using all four values of the **confusion matrix**: True Positives ($TP$), True Negatives ($TN$), False Positives ($FP$), and False Negatives ($FN$).

$$
MCC = \frac{(TP \times TN)-(FP \times FN)}{\sqrt{(TP+FP)(TP+FN)(TN+FP)(TN+FN)}}
$$
## Example

Let's consider a medical screening test for a rare disease. We test **100** patients. The disease is only present in **10** of them.

|                      | Predicted: Positive | Predicted: Negative | Row total |
| -------------------- | ------------------- | ------------------- | --------- |
| **Actual: Positive** | 7 ($TP$)            | 3 ($FN$)            | 10        |
| **Actual: Negative** | 5 ($FP$)            | 85 ($TN$)           | 90        |
| **Column total**     | 12                  | 88                  | 100       |

**1. Accuracy**

$$
Accuracy = \frac{7 + 85}{100} = 0.92
$$

At **92%**, accuracy is misleadingly high because it is dominated by the majority (healthy) class.

**2. The F1-score Paradox**

The primary flaw of the F1-Score is that it is **asymmetric**: it changes depending on which class you define as "Positive." 

Let's illustrate this by first calculating the F1-score of correctly predicting **sick** patients (our base example).

$$
\begin{align}
\text{F1}_{sick} & = \frac{2TP}{2TP+FP+FN}\notag\\
& = \frac{(2 \times 7)}{(2\times7)+5+3}\notag\\
& = \frac{14}{14+5+3}\notag\\
& = \frac{14}{22}\notag\\
& \approx 0.636\notag\\
\end{align}
$$

Now, let's assume we simply swap our perspective and define *healthy* patients as Positive. The prediction task hasn't changed, only how we label outcomes. The new confusion matrix is:

|                      | Predicted: Positive | Predicted: Negative | Row total |
| -------------------- | ------------------- | ------------------- | --------- |
| **Actual: Positive** | 85 ($TP$)           | 5 ($FN$)            | 90        |
| **Actual: Negative** | 3 ($FP$)            | 7 ($TN$)            | 10        |
| **Column total**     | 88                  | 12                  | 100       |
and the new F1-score is:
$$
\begin{align}
\text{F1}_{healthy} & = \frac{2TP}{2TP+FP+FN}\notag\\
& = \frac{(2 \times 85)}{(2\times85)+3+5}\notag\\
& = \frac{170}{170+3+5}\notag\\
& = \frac{170}{178}\notag\\
& \approx 0.955\notag\\
\end{align}
$$

The F1-score gives two completely different evaluations (0.64 vs 0.96) for the _exact same model performance_ just by changing the label name !

**3. Calculate MCC**

$$
\begin{align}
\text{MCC} & = \frac{(7 \times 85) - (5 \times 3)}{\sqrt{(7+5)(7+3)(85+5)(85+3)}}\notag\\
& = \frac{595 - 15}{\sqrt{12 \times 10 \times 90 \times 88}}\notag\\
& = \frac{580}{\sqrt{950,400}}\notag\\
& \approx \frac{580}{974.88}\notag\\
& \approx 0.595\notag\\
\end{align}
$$

**Conclusion**

While the accuracy was **0.92**, the MCC is **~0.60**. This provides a more realistic view of the model's performance, showing that while it is good, it is not nearly as "perfect" as the 92% accuracy might suggest for this imbalanced dataset.

## Usage

- **Interpretation of the Score**:
    - **+1**: Represents a perfect prediction.
    - **0**: No better than a random prediction.
    - **-1**: Indicates total disagreement between prediction and observation.

- **Imbalanced Datasets**: MCC is much more reliable than accuracy or F1-score when class sizes vary significantly. Because it considers all four cells of the confusion matrix equally, a model must perform well on both the majority and minority classes to achieve a high score.

- **Symmetry**: Unlike metrics like Precision, Recall or F1-score, MCC is symmetric. If you swap the "Positive" and "Negative" definitions, the MCC value remains unchanged.

- **Comparison with [Cohen's Kappa](https://antoine-does-ai.com/Research-review/Concepts/Metrics/Cohen's-Kappa-score)**: While both account for chance, MCC is a direct correlation coefficient. In modern ML research, MCC is often preferred because it is more mathematically robust to extreme class imbalances than Kappa.