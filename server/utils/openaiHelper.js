// server/utils/openaiHelper.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Esegue una richiesta di completamento in streaming.
 * @param {string} role - Il ruolo dell'esperto (es. "Psicologo").
 * @param {string} prompt - Il prompt utente da inviare.
 * @param {function} onData - Callback per ogni frammento di testo ricevuto.
 * @param {function} onEnd - Callback quando il completamento è finito.
 * @param {function} onError - Callback in caso di errore.
 */
export async function streamExpertResponse(role, prompt, onData, onEnd, onError) {
  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `Sei un ${role}. Rispondi in modo chiaro, professionale e con tono umano.` },
        { role: "user", content: prompt }
      ],
      stream: true,
      temperature: 0.7,
    });

    for await (const part of stream) {
      const content = part.choices?.[0]?.delta?.content;
      if (content) {
        onData(content);
      }
    }

    onEnd();
  } catch (error) {
    console.error("Errore durante lo streaming OpenAI:", error);
    onError(error);
  }
}
