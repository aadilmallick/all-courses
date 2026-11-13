let activeUtterance:SpeechSynthesisUtterance|null=null;
export function frenchVoices(){return 'speechSynthesis'in window?speechSynthesis.getVoices().filter(voice=>/^fr([-_]|$)/i.test(voice.lang)):[];}
export function speakFrench(text:string,rate=0.9,voiceURI?:string,onError?:(message:string)=>void){
  if(!('speechSynthesis'in window)){onError?.('Speech synthesis is unavailable in this browser.');return false;}
  const phrase=String(text).trim();if(!phrase){onError?.('Select or enter some French text first.');return false;}
  const voices=frenchVoices();
  const voice=voices.find(voice=>voice.voiceURI===voiceURI)||voices.find(voice=>/^fr-FR$/i.test(voice.lang)&&voice.localService)||voices.find(voice=>/^fr-FR$/i.test(voice.lang))||voices[0];
  if(!voice){onError?.('No French voice is installed yet. Add a French speech voice in your device settings, then reload.');return false;}
  stopSpeech();const utterance=new SpeechSynthesisUtterance(phrase.slice(0,1800));utterance.lang=voice.lang;utterance.voice=voice;
  utterance.rate=Number.isFinite(rate)?Math.max(0.5,Math.min(rate,1.5)):0.9;activeUtterance=utterance;
  utterance.onend=()=>{if(activeUtterance===utterance)activeUtterance=null;};
  utterance.onerror=event=>{if(activeUtterance===utterance)activeUtterance=null;if(event.error!=='canceled'&&event.error!=='interrupted')onError?.('The French voice could not play. Try another installed voice.');};
  speechSynthesis.speak(utterance);return true;
}
export function stopSpeech(){if('speechSynthesis'in window)speechSynthesis.cancel();activeUtterance=null;}
