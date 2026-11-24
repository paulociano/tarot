import {deck,} from './deck.js';
import {DREAM_KEY,checkedDreams,mergeDreams} from './dream-data.js';
import {validRecord} from './engine.js';
import {importJournal,journalBackup} from './storage.js';
import {journeyProgress} from './journey.js';
import {validTemplates} from './custom-ritual.js';
const FORMAT='arcana-vault', VERSION=1, ITERATIONS=600000;
const MAX_PLAIN=5_000_000;
export const MAX_VAULT_FILE=7_000_000;
const KEYS={records:'arcana-journal-v1',favorites:'arcana-favorites-v1',chapters:'arcana-journey-v1',templates:'arcana-custom-rituals-v1',dreams:DREAM_KEY};
const known=new Set(deck.map(c=>c.id));
const favoritesOf=x=>Array.isArray(x)?[...new Set(x.filter(id=>known.has(id)))]:[];
const enc=new TextEncoder(),dec=new TextDecoder();
export function makeVault({records=[],favorites=[],chapters=[],templates=[],dreams=[]}={}){
 const data={format:FORMAT,version:VERSION,records:importJournal(JSON.stringify(journalBackup(records)),[]).records,favorites:favoritesOf(favorites),chapters:journeyProgress(chapters),templates:validTemplates(templates),dreams:checkedDreams(dreams)};
 if(enc.encode(JSON.stringify(data)).length>MAX_PLAIN)throw Error('O cofre excede 5 MB de conteúdo. Exporte o diário separadamente.');
 return data;
}
function checked(data){
 if(!data||data.format!==FORMAT||data.version!==VERSION||!Array.isArray(data.records)||data.records.length>5000||!data.records.every(validRecord)||!Array.isArray(data.favorites)||data.favorites.length>78||!data.favorites.every(id=>known.has(id))||!Array.isArray(data.chapters)||data.chapters.length>22||journeyProgress(data.chapters).length!==data.chapters.length||!Array.isArray(data.templates)||data.templates.length>50||validTemplates(data.templates).length!==data.templates.length)throw Error('Cofre incompatível ou corrompido.');
 if(Object.hasOwn(data,'dreams'))checkedDreams(data.dreams);
 return makeVault(data);
}
export function mergeVault(current,incoming){
 const c=makeVault(current),b=checked(incoming);
 const result=importJournal(JSON.stringify(journalBackup(b.records)),c.records);
 const ids=new Set(c.templates.map(t=>t.id));const additional=b.templates.filter(t=>!ids.has(t.id));
 if(c.templates.length+additional.length>50)throw Error('A união ultrapassa 50 modelos. Libere espaço no Arquiteto antes de importar.');
 if(result.records.length>5000)throw Error('A união ultrapassa 5.000 registros.');
 const dreamMerge=mergeDreams(c.dreams,b.dreams);
 const merged=makeVault({dreams:dreamMerge.rows,records:result.records,favorites:[...c.favorites,...b.favorites],chapters:[...c.chapters,...b.chapters],templates:[...c.templates,...additional]});
 return {data:merged,added:{records:result.added,favorites:merged.favorites.length-c.favorites.length,chapters:merged.chapters.length-c.chapters.length,templates:additional.length,dreams:dreamMerge.added},preserved:{records:result.skipped,templates:b.templates.length-additional.length,dreams:dreamMerge.preserved}};
}
function base64(bytes){let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s)}
function from64(s){if(typeof s!=='string'||!s.length||s.length>MAX_VAULT_FILE||!/^[A-Za-z0-9+/]+={0,2}$/.test(s))throw Error('Arquivo de cofre inválido.');return Uint8Array.from(atob(s),c=>c.charCodeAt(0))}
function passwordOK(pass){if(typeof pass!=='string'||pass.length<12||pass.length>256)throw Error('Use uma senha de 12 a 256 caracteres.');if(!globalThis.crypto?.subtle)throw Error('Criptografia indisponível. Abra ARCANA em HTTPS.')}
async function derive(pass,salt){passwordOK(pass);const material=await crypto.subtle.importKey('raw',enc.encode(pass),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:ITERATIONS,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
const aad=enc.encode('ARCANA-VAULT/1/PBKDF2-SHA256/600000/AES-GCM');
export async function encryptVault(data,password){passwordOK(password);const valid=checked(data),salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),key=await derive(password,salt);const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad},key,enc.encode(JSON.stringify(valid)));return JSON.stringify({format:'arcana-vault-encrypted',version:1,salt:base64(salt),iv:base64(iv),ciphertext:base64(new Uint8Array(ciphertext))})}
export async function decryptVault(text,password){
 passwordOK(password);if(typeof text!=='string'||text.length>MAX_VAULT_FILE)throw Error('Arquivo excede o limite de 7 MB.');
 let data;try{data=JSON.parse(text)}catch{throw Error('Arquivo de cofre inválido.')}
 if(data?.format!=='arcana-vault-encrypted'||data.version!==1)throw Error('Selecione um cofre ARCANA criptografado.');
 try{const salt=from64(data.salt),iv=from64(data.iv),encrypted=from64(data.ciphertext);if(salt.length!==16||iv.length!==12||encrypted.length>MAX_PLAIN+16)throw Error('size');const key=await derive(password,salt);const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:aad},key,encrypted);return checked(JSON.parse(dec.decode(plain)))}catch{throw Error('Senha incorreta, arquivo alterado ou cofre incompatível.')}
}
// Validate and serialize before touching storage. Restore previous keys if a write fails.
export function applyVault(storage,data){const valid=checked(data);const entries=Object.entries(KEYS).map(([field,key])=>[key,JSON.stringify(valid[field])]);const before=entries.map(([key])=>[key,storage.getItem(key)]);let written=0;try{for(const [key,value] of entries){storage.setItem(key,value);written++}}catch{let restored=true;for(const [key,value] of before.slice(0,written).reverse()){try{if(value===null)storage.removeItem(key);else storage.setItem(key,value)}catch{restored=false}}throw Error(restored?'Armazenamento insuficiente. Os dados anteriores foram preservados.':'Falha de armazenamento. Confira os registros e use um backup anterior.')}return valid}
