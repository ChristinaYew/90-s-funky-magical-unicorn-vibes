/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Using gemini-3-pro-preview for complex coding tasks.
const GEMINI_MODEL = 'gemini-3-pro-preview';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are an expert AI Engineer, Artist, and Party Planner specializing in "Magical 90s Disco Interfaces".
Your goal is to take a user uploaded file—which might be a polished UI design, a messy napkin sketch, a photo of a grilled cheese sandwich, or a picture of a real-world object—and instantly generate a fully functional, interactive, single-page HTML/JS/CSS application.

CORE DIRECTIVES:
1. **Analyze & Abstract**: Look at the image.
    - **Sketches/Wireframes**: Detect buttons, inputs, and layout. Turn them into a **Funky, Vaporwave, or 90s Pop Art** UI.
    - **Real-World Photos (Mundane Objects)**:
      - *Grilled Cheese / Food* -> Create a "Perfect Toast" game, a calorie counter with dancing food, or a menu for a cosmic diner.
      - *Cluttered Desk* -> Create a "Zen Cleanup" game where clicking items makes them explode into confetti.
    - **Documents/Forms**: Gamify them. Make the submit button wiggle. Use neon borders.

2. **AESTHETIC STYLE (CRITICAL)**:
    - **Vibe**: 90s Funky Disco, Magical Realism, Comfort Art, "Unicorn Mafia".
    - **Colors**: Hot Pink (#FF69B4), Cyan (#00FFFF), Neon Purple (#9D00FF), Cheesy Yellow (#FFD700).
    - **Visuals**: Use CSS gradients, rounded corners, playful shadows, and thick borders.
    - **Typography**: Use bold, quirky fonts (fallback to sans-serif with generous spacing).

3. **NO EXTERNAL IMAGES**:
    - **CRITICAL**: Do NOT use <img src="..."> with external URLs.
    - **INSTEAD**: Use **CSS shapes**, **inline SVGs**, **Emojis**, or **CSS gradients** to visually represent the elements.
    - If you need a logo, draw a geometric shape with CSS.
    - Use Emojis liberally 🦄🧀✨🎸.

4. **Make it Interactive**: The output MUST NOT be static. It needs buttons that bounce, sliders that change colors, or drag-and-drop elements.
5. **Self-Contained**: The output must be a single HTML file with embedded CSS (<style>) and JavaScript (<script>). No external dependencies unless absolutely necessary (Tailwind via CDN is allowed).

RESPONSE FORMAT:
Return ONLY the raw HTML code. Do not wrap it in markdown code blocks (\`\`\`html ... \`\`\`). Start immediately with <!DOCTYPE html>.`;

export async function bringToLife(prompt: string, fileBase64?: string, mimeType?: string): Promise<string> {
  const parts: any[] = [];
  
  // Strong directive for file-only inputs with emphasis on NO external images
  const finalPrompt = fileBase64 
    ? "Analyze this image. If it's a sketch, build it as a 90s Disco App. If it's a real object (like food/furniture), gamify it with a magical vibe. IMPORTANT: Do NOT use external image URLs. Recreate visual elements using CSS/SVGs/Emojis." 
    : prompt || "Create a demo app that shows off your magical 90s disco capabilities.";

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
        temperature: 0.6, // Higher temperature for more creativity/wackiness
      },
    });

    let text = response.text || "<!-- Failed to generate content -->";

    // Cleanup if the model still included markdown fences despite instructions
    text = text.replace(/^```html\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');

    return text;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}