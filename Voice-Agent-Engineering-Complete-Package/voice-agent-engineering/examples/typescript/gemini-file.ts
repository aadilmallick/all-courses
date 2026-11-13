/** Server-side Node 24 WebSocket. Input is raw 16 kHz mono PCM16, WITHOUT WAV header. */
import {readFile,writeFile} from 'node:fs/promises';
const audio=await readFile(process.argv[2]);
if(audio.length%2 || audio.subarray(0,4).toString()==='RIFF')throw Error('Expected raw mono PCM16, no WAV header');
const key=process.env.GEMINI_API_KEY;if(!key)throw Error('Set GEMINI_API_KEY');
const socket=new WebSocket('wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key='+encodeURIComponent(key));
let chunks:Buffer[]=[], timer:ReturnType<typeof setInterval>|undefined, offset=0, completed=false;
const deadline=setTimeout(()=>{console.error('Live turn timed out');process.exitCode=1;socket.close();},60000);
socket.onopen=()=>socket.send(JSON.stringify({setup:{model:'models/'+(process.env.GEMINI_LIVE_MODEL??'gemini-3.8-live'),generationConfig:{responseModalities:['AUDIO']}}}));
socket.onmessage=async(event)=>{
  try {
    const raw=typeof event.data==='string'?event.data:await event.data.text();const message=JSON.parse(raw);
    if(message.error)throw Error('Provider returned an error');
    if(message.setupComplete && !timer)timer=setInterval(()=>{
      if(socket.readyState!==WebSocket.OPEN)return;
      if(offset<audio.length){socket.send(JSON.stringify({realtimeInput:{audio:{data:audio.subarray(offset,offset+640).toString('base64'),mimeType:'audio/pcm;rate=16000'}}}));offset+=640;}
      else{clearInterval(timer);socket.send(JSON.stringify({realtimeInput:{audioStreamEnd:true}}));}
    },20);
    const content=message.serverContent;
    if(content?.interrupted)chunks=[];
    for(const part of content?.modelTurn?.parts??[])if(part.inlineData?.mimeType?.startsWith('audio/pcm'))chunks.push(Buffer.from(part.inlineData.data,'base64'));
    if(content?.turnComplete){completed=true;clearTimeout(deadline);clearInterval(timer);await writeFile('gemini-reply.pcm',Buffer.concat(chunks));socket.close();console.log('Saved gemini-reply.pcm (24 kHz mono PCM16)');}
  }catch{console.error('Gemini protocol or output error; URL omitted');process.exitCode=1;socket.close();}
};
socket.onerror=()=>{console.error('Gemini connection error; URL omitted');process.exitCode=1;};
socket.onclose=()=>{clearTimeout(deadline);clearInterval(timer);if(!completed){console.error('Closed without a complete turn');process.exitCode=1;}};
