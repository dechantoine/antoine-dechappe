---
title: Cohen's Kappa score
draft: false
paper: 
date: 2025-06-25
---
## Definition

**Cohen's Kappa score** is a statistic used to **measure inter-rater reliability** (or inter-annotator agreement) of two raters for categorical items. Kappa takes into account the possibility of agreement occurring by chance. Cohen's kappa assumes the two raters have rated the same  set of items.

## Formula

Let 
>$X=(x_1,...x_N)$ be a dataset of $N$ input values,
>
>$Y=(y_1,...,y_C)$ the set of $C$ possible categorical outputs,
>
>$h_1:X→Y$, $h_2:X→Y$ two classifiers from $X$ to $Y$,
>
>$M∈M_{C \times C}(\mathbb{N})$ the confusion matrix of classification from $h_1$ and $h_2$

Then $P_o$ the **observed proportion of agreement between the $K$ classifiers** is:
$$
P_0=\frac{1}{N}\sum_{c=1}^{C}\text{diag}(M)_c
$$
Let
>$n_{k,c}$ be the number of samples classified by $h_k$ into category $c$,
>
>$\widehat{p_{k,c}}$ the estimated probability that $h_k$ will classify an item into $c$,
>
>$\widehat{p_{c}}$ the estimated probability that all $h_1$ and $h_2$ will classify the same item into $c$

Then $P_e$ the **expected proportion of agreement by chance** is:

$$
\begin{align}
P_e & = \sum_{c=1}^{C}\widehat{p_{c}}\notag\\
 & = \sum_{c=1}^{C}\widehat{p_{1,c}} \times \widehat{p_{2,c}} && \text{(indep.)}\notag\\
 & = \sum_{c=1}^{C}\frac{n_{1,c}}{N} \times \frac{n_{2,c}}{N}\notag\\
& =\frac{1}{N^2} \sum_{c=1}^{C}n_{1,c} \times n_{2,c}\notag\\
\end{align}
$$

then finally the Kappa score is:
$$
Kappa = \frac{P_o - P_e}{1 - P_e}
$$
## Example

Let's consider a binary classification problem where a model predicts whether an email is "Spam" or "Not Spam". We have 100 emails that have been classified by both our model and a human annotator (ground truth). The results are summarized in the following confusion matrix:

|                     | Model: Spam | Model: Not Spam | Row total |
| ------------------- | ----------- | --------------- | --------- |
| **Human: Spam**     | 20          | 10              | 30        |
| **Human: Not Spam** | 5           | 65              | 70        |
| **Column Total**    | 25          | 75              | 100       |


**1. Calculate Observed Agreement ($P_o$​)**

The observed agreement is the proportion of instances where the model and the human annotator agreed. This occurs for "Spam" (20 instances) and "Not Spam" (65 instances).

$$
\begin{align}
P_o & =\frac{\text{Number of Agreements​}}{\text{Total Instances}}\notag\\
& =\frac{20+65}{100}\notag\\
& ​=0.85\notag\\
\end{align}
$$

**2. Calculate Expected Agreement ($P_e$​)**

First, we calculate the probability of agreeing on "Spam" by chance:

- The model classified 25 out of 100 as "Spam" (Probability = 0.25).
- The human classified 30 out of 100 as "Spam" (Probability = 0.30).
- The probability of both randomly choosing "Spam" is $0.25×0.30=0.075$.

Next, we calculate the probability of agreeing on "Not Spam" by chance:

- The model classified 75 out of 100 as "Not Spam" (Probability = 0.75).
- The human classified 70 out of 100 as "Not Spam" (Probability = 0.70).
- The probability of both randomly choosing "Not Spam" is $0.75×0.70=0.525$.

The total expected agreement by chance is the sum of these probabilities:

$$
\begin{align}
Pe & ​=0.075+0.525 \notag\\
& =0.60 \notag\\
\end{align}
$$

**3. Calculate Cohen's Kappa**

Now we can plug $P_o$​ and $P_e$​ into the Kappa formula:

$$
\begin{align}
Kappa & = \frac{P_o - P_e}{1 - P_e}\notag\\
& = \frac{0.85 - 0.60}{1-0.60}\notag\\
& = 0.625\notag\\
\end{align}
$$

So, the Cohen's Kappa score for this model is **0.625**, which indicates a "substantial" level of agreement.

## Usage

- **Interpretation of the Score**: The Kappa value ranges from -1 to 1.
    - **1**: Perfect agreement between the raters.
    - **0**: The agreement is equivalent to what would be expected by chance.
    - **<0**: The agreement is weaker than what would be expected by chance, which is rare.

- **Imbalanced Datasets**: Cohen's Kappa is particularly useful for classification tasks with imbalanced classes. Accuracy can be misleading in these scenarios because a model can achieve a high accuracy by simply predicting the majority class. Kappa helps to mitigate this by accounting for chance agreement.
    
- **Limitations**:
    - **Number of Raters**: Cohen's Kappa is designed for two raters. For more than two, a different statistic like Fleiss' Kappa is used.
    - **Subjectivity of Thresholds**: The interpretation of what constitutes a "good" Kappa score can be context-dependent and subjective. A Kappa of 0.6 might be acceptable in some fields but considered poor in others where higher precision is required, such as medical diagnostics.
    - **Ordinal Data**: Standard Cohen's Kappa does not differentiate between degrees of disagreement for ordinal data (e.g., rating scales). For instance, a disagreement between "Slightly Relevant" and "Very Relevant" is treated the same as a disagreement between "Slightly Relevant" and "Very Irrelevant". A weighted Kappa can be used in these situations to account for the severity of disagreements.