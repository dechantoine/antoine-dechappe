---
title: Efficient LLMs in production
draft: true
tags: 
date: 2025-03-22
---
#  Before you start your GenAI project...

## ...do you really need an LLM to do the job ?

- LLMs are the most useful **when an answer is hard (or timely) to make, but is easy to check.**
- LLMs excels at creating content and stimulating our own imagination.
- As for every ML component in your system or workflow, **you should accept no 100% accuracy**: LLMs can sometimes generate inaccurate or biased content.

## ...keep in mind that

- **All LLMs become obsolete** at one point and closed-sources ones are frequently deprecated by providers: don't get too dependent of one.
- **LLMs will hopefully become better and better**: even if your pipeline performances are not satisfying at the moment, give it another try in 6 months with the latest model.
- **LLMs inference will decrease over time** and I bet it will be exponentially: ROI should also be adjusted frequently.
- LLM provider are progressively rolling out **KV caching** ,so adapt your prompt to leverage this capacity and decrease your costs.
- **LLM finetuning dataset is crucial** to understand what steers the model behavior: try to know how instructions are structured in the finetuning set and stick to the same format.
- In addition to what will follow,  a GenAI project should follow the usual guidelines and requirements of an AI project: curated data, extensive evaluation before deployment, monitoring of application, etc.

# Models

## How to choose your model ?

### Inputs, outputs

- Modalities: do you need to deal only with text, or will you have also images, sounds ?
- Capabilities: do you need a model with access to the internet, a model with advanced reasoning capabilities ?
- Interoperability: does your model need to access and interact with tools you will provide ?
- Streaming: does your model need to response in a stream or will be bulk sufficient ?

### Open-weight or closed models ?

- Open models give **better data control, finetuning options, and possibly latency** (on-premises deployment).
- Closed models offer **better out-of-the-box alignment and security guarantees** but less customization.

### Benchmarks



### Pricing

For closed-source models served via API, pay-as-you-go pricing is mostly a function of:
- **Number of input tokens**, their modalities and if they exceed a certain length
- **Number of output tokens**, their modalities and if they exceed a certain length
- Length of internal thinking (you won't have much lever on this one)

You may also have the option to choose a dedicated endpoint. This is often a cheaper plan beyond more than a billion of tokens over a given time period (so do your math !) but also offer the great advantage of guaranteed SLAs.

# Prompts 

## Prompts management

- **Use markdown to store your prompts**: 
	- Well integrated in most IDE and suitable with a lot of Version Control Systems
	- Easy to give structure

- **Think about others:** 
	- think about the saved prompts as being primarily for other maintainers of the prompt rather than just the LLM.
	- document your hacks to steer the model towards the desired behavior, as they will naturally tend to become useless.

- **Keep it simple:** 
	- The “technical debt” incurred by your prompt is proportional to its length and overall complexity. 
	- **Prompts are intimately tied to a specific checkpoint**. Every time the underlying model changes, it’s worth quantitatively and qualitatively checking that your prompt still works. 
	- Don’t try to add more details to a prompt if a simpler prompt would do.

## How does most LLMs like to be instruct ?

- Most LLMs needs **explicit instructions to inform their role-play** of who they are, where they are, and what they should find relevant in their environment.

- They have been finetuned with **specific tokens** for defining roles, tools and tasks: it is crucial to identify those tokens (either in document or in the dictionary of the tokenizer) and to use them properly

- **Prefer zero-shot instructions over few-shot instructions:** Zero-shot are easier to understand, debug and reason about. They are plenty of cases where few-shoting is worse than zero-shot, mostly because it is biaising the model too much. Use few-shot examples as a last resort.

# Efficient workflows

## Frameworks

Many open-source frameworks compete for the 

LLMs wrapping:
	-

Orchestration:

## Structured Outputs

LLMs typically produces text output. However, you can constrain some of them to produce structured output in JSON format for applications that require it. You can also use an enum, which is a list of strings, in your schema to constrain the model to respond with one of a set of specified options.

Using structured output can be useful in a variety of scenarios. For example, you might want to:
- Build a database by extracting information from articles
- Extract standardized information from resumes
- Extract ingredients from recipes and connect them with grocery websites
- Classify images into predetermined categories

Structured outputs offer great advantages and should be enforced as much as possible:
- They integrate perfectly in workflows with a 100% respect of expected format
- They interoperate seamlessly with typical typing packages

## Tools & functions

- **Design clear, concise schemas** for function parameters. Keep types explicit (strings, numbers, enums) and avoid complex nested structures unless necessary.

- **Validate and sanitize** model outputs before executing functions, especially if user data is involved.

- Implement timeouts and retries on external calls.
- Provide fallback strategies if a tool fails (e.g., skip, retry, or escalate to human intervention).


# Experiments & performance tracking

- **Decompose the problem into sub-problems** and chain inferences together: 
	- by making each sub-problem small enough, they’re usually better specified and easier to check/evaluate.
	- as inference costs will sunk, there will be no point trying to solve your problem in a sole call.

- A performance metric for an LLM task is tied with (at least) all this parameters:
	- the full model ID
	- the prompt
	- tools provided to the LLM (and how they are provided)
	- sampling parameters (temperature, top-k, top-p, frequencies penalty, etc.)
	- SDK used (most of them made several assumptions)

- Maintain **golden datasets** with **human-reviewed labels** for continuous validation.

- Log 



