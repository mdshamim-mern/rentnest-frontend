import { z } from 'zod';
export class AIError extends Error { constructor(public status:number,message:string){super(message);} }
export const searchSchema=z.object({location:z.string().max(100),propertyType:z.enum(['','Apartment','Duplex','Studio','Villa','Penthouse']),beds:z.string().regex(/^(|[1-5]|5\+)$/),maxPrice:z.string().regex(/^(|[0-9]{1,8})$/)}).strict();
export async function generateAI(instruction:string,text:string) {
 const key=process.env.GEMINI_API_KEY;
 if(!key) throw new AIError(503,'AI is not configured yet. Please use the standard filters or contact support.');
 const model=process.env.GEMINI_MODEL || 'gemini-2.5-flash';
 if(!/^[a-zA-Z0-9.-]+$/.test(model)) throw new AIError(503,'AI configuration is unavailable.');
 let response:Response;
 const options={method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({systemInstruction:{parts:[{text:instruction}]},contents:[{role:'user',parts:[{text}]}],generationConfig:{responseMimeType:'application/json',temperature:0.2,maxOutputTokens:2400}}),signal:AbortSignal.timeout(25000),cache:'no-store' as const};
 try {
 response=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent',options);
 if(response.status===404){
 const list=await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000',{headers:{'x-goog-api-key':key},signal:options.signal,cache:'no-store'});
 if(list.ok){const available=await list.json();const names=(available.models||[]).filter((item:{name:string;supportedGenerationMethods?:string[]})=>item.supportedGenerationMethods?.includes('generateContent')&&/^models\/gemini-[0-9.]+-flash$/.test(item.name)).map((item:{name:string})=>item.name as string).sort((a:string,b:string)=>b.localeCompare(a,undefined,{numeric:true}));
 if(names[0])response=await fetch('https://generativelanguage.googleapis.com/v1beta/'+names[0]+':generateContent',options);
 }
 }
 }catch {throw new AIError(504,'AI timed out. Please try again or use standard filters.');}
 if(!response.ok) {
 let reason='';
 try {const body=await response.json();reason=String(body.error?.details?.find((detail:{reason?:string})=>detail.reason)?.reason||'');} catch {}
 if(reason==='API_KEY_INVALID' || response.status===401) throw new AIError(503,'The AI API key is invalid. Update GEMINI_API_KEY in the frontend production environment and redeploy.');
 if(response.status===403) throw new AIError(503,'AI access is denied. Check the API key restrictions and Gemini API access in Google Cloud.');
 if(response.status===404) throw new AIError(503,'The configured AI model is unavailable. Set GEMINI_MODEL to an available Gemini text model and redeploy.');
 if(response.status===429) throw new AIError(429,'AI quota is exhausted or busy. Check the Google AI project quota and retry later.');
 if(response.status===400) throw new AIError(503,'The AI provider rejected the configuration. Check the API key, model and Google AI project settings.');
 throw new AIError(502,'AI provider is unavailable. Please try again later.');
 }
 try {const body=await response.json();const content=body.candidates?.[0]?.content?.parts?.map((p:{text?:string})=>p.text||'').join('');if(!content)throw new Error();return JSON.parse(content);}
 catch {throw new AIError(502,'AI returned an invalid response. Please try again.');}
}
export async function readQuestion(req:Request) {
 if(Number(req.headers.get('content-length')||0)>8000)throw new AIError(413,'Your message is too long.');
 let body;try{body=await req.json();}catch{throw new AIError(400,'A valid JSON message is required.');}
 const parsed=z.object({text:z.string().trim().min(3).max(1000)}).safeParse(body);
 if(!parsed.success)throw new AIError(400,'Enter a message between 3 and 1,000 characters.');
 return parsed.data.text;
}
export function aiFailure(error:unknown) {return Response.json({success:false,error:error instanceof AIError?error.message:'AI returned an invalid response. Please retry.'},{status:error instanceof AIError?error.status:502});}
