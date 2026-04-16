import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize the Groq client securely on the server
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { questions } = await req.json();

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron preguntas." },
        { status: 400 }
      );
    }

    // Format the incoming questions for the prompt
    const questionsText = questions
      .map((q: any) => `- [${q.autor || "Anónimo"}]: ${q.pregunta}`)
      .join("\n");

    const systemPrompt = `
Eres un experto Moderador Jefe para el evento académico 'XI Diálogos en el Instituto IMEESDM'.
Tu objetivo es leer las preguntas del público en bruto, agruparlas por temas similares, descartar las irrespetuosas o que no tengan sentido, y presentar un resumen accionable para los moderadores humanos en vivo.

DEBES RESPONDER ÚNICAMENTE CON UN JSON VÁLIDO. SIN TEXTO ANTES NI DESPUÉS.
Formato JSON esperado:
{
  "clusters": [
    {
      "tema": "Título del tema general",
      "cantidad": 5,
      "pregunta_sintetizada": "La mejor forma de hacer esta pregunta englobando las dudas del grupo es..."
    }
  ],
  "descartadas": 1
}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Aquí están las preguntas recopiladas recientemente:\n\n${questionsText}` }
      ],
      model: "llama3-70b-8192", // Using the extremely fast 70B model
      temperature: 0.2, // Low temperature for deterministic/factual clustering
      response_format: { type: "json_object" },
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error("No response from Groq");
    }

    return NextResponse.json({ success: true, analysis: JSON.parse(aiResponse) });

  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { error: "Error interno al procesar con IA.", details: error.message },
      { status: 500 }
    );
  }
}
