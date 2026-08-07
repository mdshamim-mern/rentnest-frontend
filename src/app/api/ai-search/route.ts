import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Extract the following details from the text: location, propertyType, beds, and maxPrice.
      If the location has a typo, correct it to the nearest valid Dhaka location (e.g., Banani, Gulshan, Dhanmondi, Bashundhara, Mirpur, Mohammadpur, Uttara, Shyamoli, Badda, Khilgaon).
      Return the output strictly as a JSON object with keys: "location", "propertyType", "beds", "maxPrice".
      OUTPUT ONLY VALID JSON. Do not include any markdown tags, backticks, or explanation.
      Text: "${text}"
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let parsedData = { location: "", propertyType: "", beds: "", maxPrice: "" };
    
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error(parseError);
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ location: "", propertyType: "", beds: "", maxPrice: "" });
  }
}