Link: https://arxiv.org/pdf/2407.08103

Language models (LMs) are often expected to generate strings in some formal language; for example, structured data, API calls, or code snippets. Although LMs can be tuned to improve their adherence to formal syntax, this does not guarantee conformance. In addition, tuning requires significant resources, making it impractical for uncommon or task-specific formats. To prevent downstream parsing errors we would ideally constrain the LM to only produce valid output, but this is severely complicated by tokenization, which is typically both ambiguous and misaligned with the formal grammar. We solve these issues through the application of automata theory, deriving an efficient closed-form solution for the regular languages, a broad class of formal languages with many practical applications, including API calls or schema-guided JSON and YAML.

One general recipe for applying constraints to any LM is to mask the decoder logits: 
1. Based on the current state of the constraint, build a mask of valid next tokens. 
2. Penalize the sampling logits using the mask, so only valid tokens are considered. 
3. Feed the selected token back to the constraint, to update its state for the next step

Tokenization is a major problem because popular LMs use data-driven sub-word tokenizers whose segmentations are generally both ambiguous and misaligned with formal-language tokens. Mapping a formal language constraint onto an arbitrary LM tokenizer involves a long tail of such special cases.

Finite-state automata (FSAs)
![[assets/automata_based_constraints_1.png]]

Finite-state transducers (FSTs) : A finite-state transducer is an FSA that generates output.
![[assets/automata_based_constraints_2.png]]

![[assets/automata_based_constraints_3.png]]

Method:
1. Detokenization as transduction : a reformulation of detokenization (i.e., the process of converting token sequences back into text) as an FST.
2. Adapting regular expressions to tokens : a generic method for adapting any FSA from characters to tokens. Specifically, given a token vocabulary V and an FSA A that accepts character sequences, A′ = A ◦ TV accepts essentially the same language as A, but in token form.
![[assets/automata_based_constraints_4.png]]

Applications:
1. JSON
2. Python dataclasses
3. Speculative decoding: a method for speeding up LM inference via speculative execution. Short runs of tokens are sampled from a faster approximation model, and then verified with a more accurate target model that accepts some prefix of the sampled tokens. Although the system now runs two LMs instead of one, significant latency reductions can still be achieved due to batching and parallelization of the target model. The speedup is largely determined by the acceptance rate, which is the proportion of speculatively-sampled tokens that pass verification.

Results:
![[assets/automata_based_constraints_5.png]]
![[assets/automata_based_constraints_6.png]]
