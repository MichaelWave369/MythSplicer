/** PocketBrain Tiny's candidate SDK is fetched ONLY after explicit user action. */
export const SDK_URL='https://michaelwave369.github.io/PocketBrain/sdk/v0.1/index.mjs';
export type Client={getStatus():{ready:boolean;device:string|null;model:string|null};load(options?:{preferredDevice?:'auto'|'webgpu'|'wasm'}):Promise<{ready:boolean;device:string|null;model:string|null}>;generate(prompt:string,options?:{mode?:'guarded'|'baseline';maxNewTokens?:number}):Promise<{text:string;receipt:Record<string,unknown>}>;dispose():Promise<void>};
export async function openTiny():Promise<Client>{
const sdk=await import(/* @vite-ignore */ SDK_URL) as {createPocketBrainTinyClient?:()=>Client};
if(typeof sdk.createPocketBrainTinyClient!=='function')throw Error('PocketBrain SDK contract unavailable.');
return sdk.createPocketBrainTinyClient();
}
export function makePrompt(role:'npc'|'dm',name:string,traits:string,scene:string,clues:string[]):string{
const header=role==='dm'?'Narrate atmosphere for a fantasy mystery. Do not assert new canonical facts.':'Speak as '+name+', a fantasy town NPC. Your traits are '+traits+'.';
return (header+' The scene is '+scene+'. Player-known clues: '+(clues.join('; ')||'none')+'. Respond in one concise sentence. No new game items, rule changes or established facts.').slice(0,1600);
}
