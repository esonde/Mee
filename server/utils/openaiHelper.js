// server/utils/openaiHelper.js
import pkg from "openai";
const { Configuration, OpenAIApi } = pkg;


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error("API key non impostata.");
}

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Esempio di funzione per streaming (vedi esempio precedente)
export async function streamExpertResponse(role, prompt, onData, onError, onEnd) {
  try {
    const response = await openai.createChatCompletion(
      {
        model: "gpt-4", // o il modello che preferisci
        messages: [
          { role: "system", content: `Sei un ${role}. Rispondi in streaming.` },
          { role: "user", content: prompt }
        ],
        stream: true,
        temperature: 0.7,
      },
      { responseType: 'stream' }
    );

    response.data.on('data', (chunk) => {
      const lines = chunk.toString('utf8').split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
        if (line.includes('[DONE]')) {
          onEnd();
          return;
        }
        try {
          const jsonStr = line.replace(/^data: /, '');
          const parsed = JSON.parse(jsonStr);
          onData(parsed);
        } catch (err) {
          onError(err);
        }
      }
    });

    response.data.on('end', () => {
      onEnd();
    });

    response.data.on('error', (err) => {
      onError(err);
    });
  } catch (err) {
    onError(err);
  }
}
