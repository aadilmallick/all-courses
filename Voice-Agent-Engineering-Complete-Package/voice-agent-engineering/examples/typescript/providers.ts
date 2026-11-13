import { readFile, writeFile } from 'node:fs/promises';
function env(name:string):string {const value=process.env[name];if(!value)throw Error(`Set ${name}`);return value;}
async function request(url:string,headers:Record<string,string>,body:BodyInit):Promise<Response> {
  const r=await fetch(url,{method:'POST',headers,body,signal:AbortSignal.timeout(60000)});
  if(!r.ok)throw Error(`Provider HTTP ${r.status}`);return r;
}
async function tts(text:string, provider:string):Promise<string> {
  let r:Response, name:string;
  if(provider==='cartesia') {
    r=await request('https://api.cartesia.ai/tts/bytes',{'Authorization':`Bearer ${env('CARTESIA_API_KEY')}`,
      'Cartesia-Version':'2026-08-14','Content-Type':'application/json'},JSON.stringify({model_id:'sonic-3.6',
      transcript:text,voice:env('CARTESIA_VOICE_ID'),output_format:{container:'wav',encoding:'pcm_s16le',sample_rate:24000}}));name='reply.wav';
  } else if(provider==='elevenlabs') {
    r=await request(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(env('ELEVENLABS_VOICE_ID'))}?output_format=mp3_44100_128`,
      {'xi-api-key':env('ELEVENLABS_API_KEY'),'Content-Type':'application/json'},
      JSON.stringify({text,model_id:process.env.ELEVENLABS_TTS_MODEL??'eleven_multilingual_v2'}));name='reply.mp3';
  } else throw Error('choose cartesia or elevenlabs');
  await writeFile(name,new Uint8Array(await r.arrayBuffer()));return name;
}
try {
  if(process.argv[2]==='tts') console.log(await tts('Your appointment options are ready to review.',process.argv[3]));
  else if(process.argv[2]==='cascade') {
    const form=new FormData();form.set('model',env('OPENAI_STT_MODEL'));
    form.set('file',new Blob([await readFile(process.argv[3])],{type:'audio/wav'}),'utterance.wav');
    const auth={'Authorization':`Bearer ${env('OPENAI_API_KEY')}`};
    const stt=await(await request('https://api.openai.com/v1/audio/transcriptions',auth,form)).json();
    const result=await(await request('https://api.openai.com/v1/responses',{...auth,'Content-Type':'application/json'},
      JSON.stringify({model:env('OPENAI_TEXT_MODEL'),input:stt.text,instructions:'Reply in one or two short spoken sentences. Do not claim to execute actions.'}))).json();
    const text=result.output.flatMap((item:any)=>item.content??[]).filter((part:any)=>part.type==='output_text').map((part:any)=>part.text).join('');
    if(!text.trim())throw Error('No spoken answer');console.log('Transcript:',stt.text,'Answer:',text,'Saved:',await tts(text,process.argv[4]));
  } else console.log('Usage: node examples/typescript/providers.ts tts cartesia|elevenlabs; or cascade utterance.wav provider');
} catch(error) {console.error('Provider example failed:',error instanceof Error?error.message:'unknown error');process.exitCode=1;}
