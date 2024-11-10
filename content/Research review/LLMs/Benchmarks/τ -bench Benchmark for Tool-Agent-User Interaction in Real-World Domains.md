Link: https://arxiv.org/pdf/2406.12045

Code: https://github.com/sierra-research/tau-bench/tree/main

## τ -bench
A benchmark emulating dynamic conversations between a user and a language agent provided with domain-specific API tools and policy guidelines.
τ -bench is built in a modular framework with (1) realistic databases and APIs, (2) domain-specific policy documents, and (3) instructions for diverse user scenarios and corresponding ground truth annotations.

Example :
An airline booking agent & a user wanting to change their flight reservation to a different destination airport.
Agent needs to gather the required information by interacting with the user, check the airline policies using the guidelines provided, and find new flights and (if possible) rebook the user using complex reservation APIs. In addition, the agent should be consistent in its behavior across different kinds of users with the same request, and robust to small changes in the conversation flow that should not affect the end outcome.
![[assets/tau_bench_2.png]]

## Experiment

τ -retail : agent is tasked with helping users cancel or modify pending orders, return or exchange delivered orders, modify user addresses, or provide information. Each product (e.g., “Water Bottle” in Figure 2a) has various item options with unique IDs (e.g., 1000ml, stainless steel, blue). Each pending order can only be canceled or modified once, and each delivered order can only be returned or exchanged once. An item cannot be modified or exchanged for another product 5 type. These constraints simplify task and API design, and challenge agents to follow domain-specific rules, and inform and collect complete information from users before taking actions.
τ -airline : the agent has to help users book, modify, or cancel flight reservations, or provide refunds. We construct 300 flights between 20 US cities with realistic durations and prices, and API tools to query direct or one-stop flights. The domain policy is more complex than τ -retail, with ad-hoc constraints about combining payment methods, checked bag allowance, flight changes and cancellations, etc. These constraints can also be over membership tier and cabin class specific, creating challenging multi-hop reasoning puzzles for the agent.

Our main method for building the agent is through the use of function calling (FC). In FC mode, the model’s system prompt is set to be the domain policy, and at each turn, the model autonomously decides to generate a user response message or a tool call. We also test text-formatted [ReAct](https://arxiv.org/abs/2210.03629)  and its Act-only ablation, where the model is instructed to zero-shot generate “Thought: {some reasoning} Action: {some JSON format action argument}” or only the action part. Notably, some agent methods are not suitable for a user-in-the-loop setup, e.g., [self-reflection](https://arxiv.org/abs/2303.11366) is unrealistic as real-world agents only have one chance to serve the user, and [planning approaches](https://arxiv.org/abs/2305.10601) might be too slow to help a user in real time.

We limit each task to at most 30 agent actions (either tool calls or user responses). For main results, we run at least 3 trials per task. **The LM temperature is 0.0**.

## Evaluation

The reward of a task episode *r* = *r*<sub>action</sub> × *r*<sub>output</sub> ∈ {0, 1} is based on 
- whether the final database is identical to the unique ground truth outcome database (*r*<sub>action</sub>), 
- whether the agent’s responses to the user contain all necessary information (*r*<sub>output</sub>).

Compares the database state at the end of a conversation with the annotated goal state. This allows for objective measurement of the agent’s decision making, while also providing room for stochastic variation in the conversation itself, since the user may pose the same request in different ways that result in the same end state of the database.

Metrics :
- $pass^k = E_{task} [\binom{c}{k} / \binom{n}{k}]$, defined as the chance that all k i.i.d. task trials are successful, averaged across tasks.
- $pass@k = 1 - E_{task} [\binom{n-c}{k} / \binom{n}{k}]$, defined as the chance that at least one out of k i.i.d. task trials is successful.

## Results

Our experiments reveal that agents built with simple LM constructs (like function calling or ReAct) perform poorly, highlighting the need for more sophisticated agent architectures. For instance, even state-of-the-art LMs like gpt-4o achieve low task success rates (pass^1) using function calling (∼61% on τ -retail and ∼35% on τ -airline). With increasing k, the chance of consistently solving a task drops rapidly, to as low as ∼25% for pass^8 on τ -retail for the same model.

![[assets/tau_bench_1.png]]

- natively supported function calling consistently outperforms text-formatted agent methods with the state-of-the-art models.
- for text-formatted agent methods, adding reasoning traces still consistently helps (compare ReAct vs. Act columns) as it helps bridge the gap between observations and actions that have unfamiliar formats. 
- adding a “think” function for function-calling agents did not boost performance, perhaps because most FC models have not been trained toward such reasoning.
- the chance of reliably and consistently solving the same task multiple times significantly drops as the number of trials k increases.

## Failures analysis

- **Reasoning Challenge**: Agents struggle with complex reasoning over databases to extract the specific information required to fulfill user requests accurately.
- **Domain Understanding Challenge**: Agents struggle to comprehend and apply domain-specific rules and knowledge provided in policy documents
- **Compound Request Challenge**: Agents lack consistency and systematicity when handling complex user requests involving multiple steps or sub-tasks. They may omit explicit or implicit user requests, particularly in longer conversations.