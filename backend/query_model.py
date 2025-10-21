# pip install openai 

from openai import OpenAI 
from dotenv import load_dotenv
import os

load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")

client = OpenAI(
    base_url = "https://rd4ezkiogcmq2ayx.us-east-1.aws.endpoints.huggingface.cloud/v1/",
    api_key = HF_TOKEN
)

chat_completion = client.chat.completions.create(
    model = "maxidl/Llama-OpenReviewer-8B",
    messages = [
        {
            "role": "user",
            "content": "What is deep learning?"
        }
    ],
    stream = True
)

for message in chat_completion:
    print(message.choices[0].delta.content, end = "")