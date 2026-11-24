// Only local speech voices: never send private reading text to a remote TTS service.
let active=null;
export function localVoice(){if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window))return null;return window.speechSynthesis.getVoices().find(v=>v.localService===true&&/^pt([-_]|$)/i.test(v.lang))||null}
export function stopNarration(){if(active){active=null;window.speechSynthesis.cancel()}}
export function narrate(text,onFinish){const voice=localVoice();if(!voice)return false;stopNarration();const utterance=new SpeechSynthesisUtterance(String(text).slice(0,8000));utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=.9;active=utterance;const end=()=>{if(active===utterance){active=null;onFinish?.()}};utterance.onend=end;utterance.onerror=end;window.speechSynthesis.speak(utterance);return true}
