import {deck} from './deck.js';
export const galleries=['Todos','Maiores','Paus','Copas','Espadas','Ouros'];
export function galleryCards(suit='Todos'){return galleries.includes(suit)?deck.filter(c=>suit==='Todos'||c.suit===suit):[...deck]}
export function stepGallery(cards,id,delta){if(!cards.length)return null;const index=Math.max(0,cards.findIndex(c=>c.id===id));return cards[Math.max(0,Math.min(cards.length-1,index+delta))].id}
export function galleryZoom(value){return Math.max(1,Math.min(3,Number.isFinite(value)?value:1))}
