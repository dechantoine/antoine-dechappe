---
title: Leverage Smolagents with Gemini
draft: true
tags: 
date: 2025-03-31
---
```python
from ast import literal_eval   
from typing import Optional, List, Dict  
  
from google.genai import Client, errors, types  
  
from loguru import logger  
from pydantic import Field  
from smolagents.models import ChatMessage  
  
  
length_limit: int = 128000  
text_input_short_cost = 18.75 * 10 ** -9  
text_input_long_cost = text_input_short_cost * 2  
text_output_short_cost = 75 * 10 ** -9  
text_output_long_cost = text_output_short_cost * 2  
  
def convert_messages_to_vertexai_contents(messages: List[Dict[str, str]]) -> tuple[str, list[types.Content]]:  
    """Converts smolagents messages to VertexAI contents.  
  
    Args:        messages: A list of messages.  
    Returns:        A tuple of system instruction and list of VertexAI contents.    """    system_instruction = [message['content'][0]['text'] if message['role'] == "system" else None for message in messages][0]  
  
    types.ModelContent(  
        parts=[types.Part.from_function_call(  
            name='get_stores_by_location',  
            args={'location': 'Paris'}  
        )]  
    ),  
    types.UserContent(  
        parts=[types.Part.from_function_response(  
            name='get_stores_by_location',  
            response={"output": ["Leroy Merlin Paris 13", "Leroy Merlin Paris 15"],  
                      'error': None}  
        )]  
    ),  
  
    list_contents = []  
    for message in messages:  
        if message['role'] == "assistant":  
            list_contents.append(types.ModelContent(parts=[types.Part.from_text(text=message['content'][0]['text'])]))  
        elif message['role'] == "user":  
            list_contents.append(types.UserContent(parts=[types.Part.from_text(text=message['content'][0]['text'])]))  
        elif message['role'] == "tool-call":  
            tools = literal_eval(message['content'][0]['text'].replace("Calling tools:\n", ""))  
            for tool in tools:  
                list_contents.append(types.ModelContent(  
                    parts=[types.Part.from_function_call(  
                        name="python_interpreter",  
                        args={'code': tool['function']['arguments']})])  
                )  
        elif message['role'] == "tool-response":  
            list_contents.append(types.UserContent(  
                parts=[types.Part.from_function_response(  
                    name='python_interpreter',  
                    response={"output": message['content'][0]['text']}  
                )]  
            ))  
  
    return system_instruction, list_contents  
  
  
class GeminiSmolAgents:  
    """Instantiates a LLM model for Gemini comatible with smolagents."""  
  
    project: str = Field(default=None)  
    model_name: str = Field(default=None)  
    location: str = Field(default=None)  
    client: Optional[Client] = None  
    temperature: Optional[float] = 0.0  
  
    short_prompt_tokens: int = 0  
    long_prompt_tokens: int = 0  
    short_completion_tokens: int = 0  
    long_completion_tokens: int = 0  
    successful_requests: int = 0  
    total_cost: float = 0  
  
    def __init__(self, **kwargs) -> None:  
        """Initializes the VertexAI chat LLM class."""  
        super().__init__(**kwargs)  
  
        self.project = os.getenv("PROJECT_ID")  
        self.model_name = os.getenv("MODEL_NAME")  
        self.location = os.getenv("LOCATION_ID")  
  
        self.client = Client(vertexai=True, project=self.project, location=self.location)  
  
        try:  
            self.client.models.get(model=self.model_name)  
        except errors.ClientError:  
            logger.error(f"Model {self.model_name} not found in project {self.project} at location {self.location}")  
            raise  
  
        logger.info(  
            f"LLMGemini initialized with model {self.model_name}"  
            f" in project {self.project} at location {self.location}"  
        )  
  
    @classmethod  
    def update_costs(cls,  
                     usage_metadata: types.GenerateContentResponseUsageMetadata,  
                     ) -> None:  
        """Update costs based on the response.  
        Args:            usage_metadata: A GenerateContentResponseUsageMetadata object.        """        prompt_tokens = usage_metadata.prompt_token_count if usage_metadata.prompt_token_count else 0  
        completion_tokens = usage_metadata.candidates_token_count if usage_metadata.candidates_token_count else 0  
  
        cls.short_prompt_tokens += min(prompt_tokens, length_limit)  
        cls.long_prompt_tokens += max(0, prompt_tokens - length_limit)  
        cls.short_completion_tokens += min(completion_tokens, length_limit)  
        cls.long_completion_tokens += max(0, completion_tokens - length_limit)  
        cls.successful_requests += 1  
  
        cls.total_cost = (  
                cls.short_prompt_tokens * text_input_short_cost  
                + cls.long_prompt_tokens * text_input_long_cost  
                + cls.short_completion_tokens * text_output_short_cost  
                + cls.long_completion_tokens * text_output_long_cost  
        )  
  
    def print_costs(self) -> None:  
        """Prints the costs for the current instance."""  
        print(  
            f"Total cost so far: {self.total_cost:.6f} USD for {self.successful_requests} requests \n"  
            f"Prompt tokens: {self.short_prompt_tokens + self.long_prompt_tokens} \n"  
            f"Completion tokens: {self.short_completion_tokens + self.long_completion_tokens}"  
        )  
  
    def generate(  
            self,  
            messages: List[Dict[str, str]],  
            stop_sequences: Optional[List[str]] = None,  
    ) -> ChatMessage:  
        """Generates text based on the input prompts.  
  
        Args:            messages: A list of messages.            stop_sequences: A list of stop sequences.  
        Returns:            A string response.        """        system_instruction, list_contents = convert_messages_to_vertexai_contents(messages)  
  
        response = self.client.models.generate_content(  
            model=self.model_name,  
            contents=list_contents,  
            config=types.GenerateContentConfig(  
                system_instruction=system_instruction,  
                temperature=self.temperature,  
                stop_sequences=stop_sequences),  
        )  
  
        GeminiSmolAgents.update_costs(response.usage_metadata)  
  
        text="".join(  
            [part.text for candidate in response.candidates for part in candidate.content.parts]  
        )  
  
        return ChatMessage(  
            role="assistant",  
            content= text  
        )
``` 
