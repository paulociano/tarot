// Deterrence of direct UI saving only. Never intercept text, keyboard shortcuts or DevTools.
export function protectArt(root){
 const selectors='.art,.back,.protected-art,.scene-painting,.scene-background,.altar-visual,.lab-mandala';
 const isArt=event=>!!event.target?.closest?.(selectors);
 for(const type of ['contextmenu','dragstart'])root.addEventListener(type,event=>{if(isArt(event))event.preventDefault()});
}
