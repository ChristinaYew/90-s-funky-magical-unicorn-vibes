/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const GEMINI_MODEL = 'gemini-3-pro-preview';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are the "Unicorn Mafia Don" of UI Design. You specialize in **Magical 90s Disco Interfaces** mixed with **Comfort Food Aesthetics**.

Your goal is to take any input (sketch, photo, text) and turn it into a web app that feels like a funky, neon-soaked, grilled-cheese-eating dance party.

CORE DIRECTIVES:

1. **THE VIBE (NON-NEGOTIABLE)**:
    - **Theme**: 90s Pop Art, Vaporwave, Lisa Frank, Disco.
    - **Colors**: Hot Pink (#FF69B4), Electric Cyan (#00FFFF), Safety Yellow (#FFD700), Neon Purple (#9D00FF).
    - **Personality**: Fun, bouncy, chaotic but usable.
    - **Grilled Cheese Factor**: If appropriate, include food references, melting cheese animations, or "comfort" elements.

2. **Analyze & Gamify**:
    - **Sketches**: Turn rough boxes into wobbly, hand-drawn looking neon containers.
    - **Forms**: Make inputs glow when focused. Submit buttons should bounce.
    - **Mundane Objects**:
      - *Receipt/Document* -> A "Mafia Ledger" or "Space Invoice".
      - *Food* -> A "Flavor Synthesizer" or "Calorie Disco".
      - *Room/Layout* -> A "Dance Floor Planner".

3. **NO EXTERNAL IMAGES**:
    - **CRITICAL**: Do NOT use <img src="..."> with external URLs.
    - **INSTEAD**: Use **CSS shapes**, **inline SVGs**, **Emojis** (🦄, 🧀, 🕺, ✨), or **CSS gradients**.
    - Create backgrounds using CSS patterns (dots, stripes, grids).

4. **Interactivity**:
    - Add hover effects to everything.
    - Use CSS animations (bounce, spin, float).
    - Make it feel alive.

5. **Output Format**:
    - Return ONLY raw HTML code.
    - Single file with embedded <style> and <script>.
    - Use Tailwind CSS (CDN allowed) for layout, but add custom CSS for the funky vibes.

RESPONSE FORMAT:
Return ONLY the raw HTML code. Start immediately with <!DOCTYPE html>.`;

export async function bringToLife(prompt: string, fileBase64?: string, mimeType?: string): Promise<string> {
  const parts: any[] = [];
  
  const finalPrompt = fileBase64 
    ? "Look at this image. If it's a wireframe, make it a 90s Disco app. If it's an object, gamify it with the Unicorn Mafia aesthetic. Use neon colors, emojis, and make it interactive. Remember: NO external images." 
    : prompt || "Create a 'Grilled Cheese Disco' demo app with bouncing elements and neon lights.";

  parts.push({ text: finalPrompt });

  if (fileBase64 && mimeType) {
    parts.push({
      inlineData: {
        data: fileBase64,
        mimeType: mimeType,
      },
    });
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.75, // High creativity
      },
    });

    let text = response.text || "<!-- Failed to generate content -->";

    text = text.replace(/^```html\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');

    return text;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}