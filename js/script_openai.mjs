// index.mjs
import 'dotenv/config';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const run = async () => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Write a one-sentence bedtime story about a unicorn." }]
  });

  console.log(response.choices[0].message.content);
};

run();
