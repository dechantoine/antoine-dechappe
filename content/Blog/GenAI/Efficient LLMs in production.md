---
title: Efficient LLMs in production
draft: false
tags: 
date: 2025-11-27
---
#  Before you start your GenAI project...

## ...do you really need an LLM to do the job ?

- LLMs are the most useful **when an answer is hard (or timely) to make, but is easy to check.**
- LLMs excels at creating content and stimulating our own imagination.
- As for every ML component in your system or workflow, **you should accept no 100% accuracy**: LLMs can sometimes generate inaccurate or biased content.

## ...keep in mind that

- **Build vs Buy**: Do you really need to build your own wrapper/chain? Can you use a managed service or a high-level API?
- **Data Privacy**: If you are using closed-source models, ensure you have a Data Processing Agreement (DPA) in place and that your data is not used for training.
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

- **Open models** (Llama 3.x, Mistral, Gemma) give **better data control, finetuning options, and possibly latency** (on-premises deployment). They are catching up rapidly in performance.
- **Closed models** (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5) offer **better out-of-the-box alignment, reasoning, and security guarantees** but less customization and data privacy control.

### Benchmarks

Don't trust marketing numbers. Rely on community-driven leaderboards:
- **LMSYS Chatbot Arena**: The gold standard for "vibes" and general helpfulness, based on human preference.
- **Open LLM Leaderboard (HuggingFace)**: Good for automated metrics on open models, but can be gamed.
- **Scale AI Leaderboards**: For coding and instruction following.
- **Your own evaluation**: The only benchmark that matters is how the model performs on *your* specific data and task.



### Pricing

### Pricing

For closed-source models served via API, pay-as-you-go pricing is mostly a function of:
- **Number of input tokens**: Input is usually cheaper than output.
- **Number of output tokens**: Output is expensive.
- **Context Caching**: Some providers (Anthropic, Google, OpenAI) offer discounts for repeated input contexts.

For open-source models (self-hosted):
- **GPU hours**: The cost of running the hardware.
- **Utilization**: You pay for the GPU whether it's processing requests or idle. High utilization is key to cost efficiency.

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

- **From Prompt Engineering to Prompt Optimization**:
    - Hand-crafting prompts is brittle. Consider using **Prompt Optimization** frameworks like **DSPy**.
    - These frameworks treat prompts as learnable parameters and optimize them based on a metric, similar to how weights are trained in ML.

- **Context Caching**:
    - If you have a long system prompt or a large document that is reused across many requests, use **Context Caching** (available in Anthropic, Gemini, OpenAI).
    - It significantly reduces latency and cost (up to 90% for cached tokens).

## How does most LLMs like to be instruct ?

- Most LLMs needs **explicit instructions to inform their role-play** of who they are, where they are, and what they should find relevant in their environment.

- They have been finetuned with **specific tokens** for defining roles, tools and tasks: it is crucial to identify those tokens (either in document or in the dictionary of the tokenizer) and to use them properly

- **Prefer zero-shot instructions over few-shot instructions:** Zero-shot are easier to understand, debug and reason about. They are plenty of cases where few-shoting is worse than zero-shot, mostly because it is biaising the model too much. Use few-shot examples as a last resort.

# Efficient workflows

## Frameworks

Many open-source frameworks compete for the orchestration layer.

- **LangChain**: The most popular, huge ecosystem, but can be complex and "bloated". Good for getting started and standard use cases.
- **LlamaIndex**: Excellent for RAG and data ingestion. Focuses on connecting data to LLMs.
- **Haystack**: robust and production-ready, great for RAG pipelines.
- **DSPy**: A radical shift from prompt engineering to programming. Great for optimizing complex pipelines.
- **Smolagents**: A lightweight, code-centric agent framework by Hugging Face.

## Agents

Agents are systems where LLMs direct the control flow.

- **ReAct**: The classic "Reason + Act" loop. The model thinks, chooses a tool, observes the output, and repeats.
- **Plan-and-Solve**: The model first generates a plan, then executes it step-by-step. Better for complex tasks.
- **Multi-Agent Systems**: Specialized agents collaborating (e.g., a Researcher, a Writer, and a Reviewer). Frameworks like **LangGraph** or **CrewAI** facilitate this.
- **Code Agents**: Agents that write and execute code (Python) to solve problems, rather than just calling JSON tools. Often more robust for math and data tasks.

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
- **Pydantic / Zod**: Use these libraries to define your schemas. Most modern LLM SDKs (OpenAI, Instructor, LangChain) support Pydantic models directly for validation and type safety.

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

- **LLM-as-a-judge**:
    - Use a strong model (e.g., GPT-4o) to evaluate the outputs of your production model.
    - Define clear criteria (helpfulness, accuracy, tone) for the judge.

- **Observability**:
    - Use tools like **LangSmith**, **Arize Phoenix**, or **Weights & Biases** to trace your chains/agents.
    - Monitor latency, token usage, and error rates in real-time.
    - Log inputs and outputs to detect drift or misuse.

# Inference Optimization

If you are self-hosting models, optimization is key to reducing latency and cost.

- **Quantization**:
    - Run models in lower precision (4-bit, 8-bit) using **bitsandbytes** or **AWQ/GPTQ**.
    - Minimal performance degradation for significant memory savings.

- **Speculative Decoding**:
    - Use a small "draft" model to predict tokens, and the large model to verify them.
    - Can speed up inference by 2x-3x without changing the output distribution.

- **vLLM / TGI**:
    - Use high-performance serving engines like **vLLM** (PagedAttention) or **Text Generation Inference (TGI)**.
    - They handle continuous batching and efficient memory management much better than standard HuggingFace pipelines.

# RAG vs Long Context

With context windows reaching 1M+ tokens (Gemini 1.5, Claude 3), do we still need RAG?

- **Use Long Context when**:
    - You have a specific, static set of documents that fits in context (e.g., a book, a codebase).
    - You need global reasoning across the entire dataset (e.g., "summarize the themes in these 50 PDFs").
    - Precision is paramount and you can't afford retrieval errors.

- **Use RAG when**:
    - Your dataset is massive (TB scale) and doesn't fit in context.
    - Data changes frequently (dynamic knowledge base).
    - Latency and cost are critical (retrieving 5 chunks is cheaper/faster than processing 1M tokens).

# Security & Guardrails

- **Prompt Injection**:
    - Treat all user input as untrusted.
    - Use guardrails (e.g., **NVIDIA NeMo Guardrails**, **Guardrails AI**) to detect and block malicious prompts.
    - Separate system instructions from user data.

- **PII Redaction**:
    - Detect and redact Personally Identifiable Information (PII) *before* sending data to the LLM.
    - Use tools like Microsoft Presidio.

- **Output Validation**:
    - Ensure the model doesn't generate harmful content or hallucinate URLs/facts.
    - Use the "LLM-as-a-judge" pattern or regex checks on the output. 



