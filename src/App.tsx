import {useEffect,useRef,useState} from 'react';
import {begin,resolve,validSave,places,npcs,type Game,type Action,type Npc} from './game';
import {openTiny,makePrompt,SDK_URL,type Client} from './pocketbrain';
const KEY='mythsplicer:bellweather:v1';
function read():Game{try{const raw=localStorage.getItem(KEY);const saved:unknown=raw?JSON.parse(raw):null;return validSave(saved)?saved:begin();}catch{return begin();}}
export default function App(){
const [game,setGame]=useState<Game>(read);
const [brain,setBrain]=useState<'idle'|'loading'|'ready'|'running'|'error'>('idle');
const [message,setMessage]=useState('Model not loaded');const [reply,setReply]=useState('');const [receipt,setReceipt]=useState<Record<string,unknown>|null>(null);
const [speaker,setSpeaker]=useState('NPC');const client=useRef<Client|null>(null);const busy=useRef(false);
useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(game));}catch{}},[game]);
const scene=places[game.place];const locals=(Object.keys(npcs) as Npc[]).filter(id=>npcs[id].place===game.place);
const chosen=locals[0];const event=game.ledger[game.ledger.length-1];
function act(action:Action){try{setGame(prev=>resolve(prev,action));setReply('');setReceipt(null);}catch(e){setMessage(String(e));}}
async function load(){
if(busy.current||client.current?.getStatus().ready)return;busy.current=true;setBrain('loading');setMessage('Importing external experimental SDK and loading pretrained ONNX model…');
try{const c=await openTiny();client.current=c;const status=await c.load({preferredDevice:'auto'});setBrain('ready');setMessage((status.model||'PocketBrain Tiny')+' ready on '+(status.device||'unknown device'));}
catch(e){setBrain('error');setMessage(e instanceof Error?e.message:String(e));}finally{busy.current=false;}
}
async function speak(role:'npc'|'dm'){
if(!client.current?.getStatus().ready||brain!=='ready')return;
setReply('');setReceipt(null);setBrain('running');setSpeaker(role==='dm'?'DM narrator':npcs[chosen].name);
const prompt=makePrompt(role,npcs[chosen].name,npcs[chosen].traits,scene.name+'. '+scene.scene,game.clues);
try{const result=await client.current.generate(prompt,{mode:'guarded',maxNewTokens:64});setReply(result.text.slice(0,1200));setReceipt(result.receipt);}
catch(e){setReply('Generation failed: '+(e instanceof Error?e.message:String(e)));}
finally{setBrain('ready');}
}
function restart(){if(window.confirm('Overwrite your local chronicle with a new one?')){setGame(begin());setReply('');setReceipt(null);}}
return <div className="shell">
<header><div className="logo"><span className="spark">✦</span><div><strong>MYTH<span>SPLICER</span></strong><small>THE STORY ENGINE</small></div></div><nav><span className="pill">● LOCAL CANON</span><button onClick={restart}>New chronicle ↻</button></nav></header>
<main><div className="eyebrow intro">ADVENTURES FOR HUMAN AND ARTIFICIAL MINDS</div><div className="hero"><div><h1>Every choice<br/><em>leaves a trace.</em></h1><p>In Bellweather, the clock has been silent for thirteen nights. Meet townsfolk, discover clues, and unravel a mystery where even the narrator must obey the rules.</p><div className="subline">◈ CHRONICLE 001 &nbsp; ◈ SINGLE-PLAYER PREVIEW &nbsp; ◈ BROWSER-LOCAL</div></div><div className="art" aria-hidden="true"><div className="moon"/><div className="spire"><div className="spiretop"/><div className="spirebody"><div className="clock">ⅩⅢ</div><div className="glow"/></div></div><div className="ground"/></div></div>
<div className="section"><span>THE ACTIVE CHRONICLE</span><span>TURN {String(game.turn).padStart(2,'0')} / SEED {game.seed}</span></div>
<div className="columns"><section className="panel location"><div className="tag">{scene.label}<span>◉ CANONICAL</span></div><h2>{scene.name}</h2><p className="prose">{scene.scene}</p><hr/><h3>YOUR NEXT MOVE</h3><div className="buttons"><button onClick={()=>act({type:'examine'})}>⌕ &nbsp; Examine the scene</button><button onClick={()=>act({type:'roll'})}>⚄ &nbsp; Roll d20</button></div><h3>PATHS FROM HERE</h3><div className="buttons">{scene.paths.map(id=><button key={id} className="outline" onClick={()=>act({type:'travel',to:id})}>↗ {places[id].name}</button>)}</div><div className="latest"><h3>LATEST CANON EVENT #{event.id}</h3><p>{event.message}</p></div></section>
<aside><section className="panel side"><h3>PEOPLE HERE</h3>{locals.map(id=><div className="person" key={id}><div className="avatar">{npcs[id].name.slice(0,2).toUpperCase()}</div><div><b>{npcs[id].name}</b><small>{npcs[id].job}</small></div><button onClick={()=>act({type:'talk',npc:id})}>Talk →</button></div>)}<p className="fineprint">These encounters are scripted. Experimental model dialogue requires explicit loading below.</p></section><section className="panel side"><h3>FIELD NOTEBOOK</h3><div className="counters"><span>PLACES <b>{game.visited.length}/3</b></span><span>CLUES <b>{game.clues.length}/3</b></span></div>{game.clues.length?<ul>{game.clues.map(c=><li key={c}>{c}</li>)}</ul>:<p className="fineprint">No clues found yet. Explore the town.</p>}</section></aside></div>
<div className="section"><span>THE LOCAL MIND</span><span>EXPERIMENTAL · EXPLICIT OPT-IN</span></div>
<section className="panel brain"><div><div className="gold">✳ POCKETBRAIN TINY / SDK CANDIDATE</div><h2>A mind behind the eyes.</h2><p>Invite a real pretrained local ONNX model to improvise an NPC's speech or narrate the mood. AI output is never canonical world state.</p><p className="fineprint">Only clicking Load imports PocketBrain JavaScript from GitHub Pages, then downloads Transformers.js from jsDelivr and pretrained model/tokenizer files from Hugging Face. First load needs internet and may be large. Inference then runs in your browser when supported. No cloud-model fallback is used.</p></div><div><div className="model-status"><i className={'dot '+brain}/>{message}</div>{(brain==='idle'||brain==='error')&&<button className="primary" onClick={load}>Load real local model ↗</button>}{brain==='loading'&&<p>Loading model and runtime…</p>}{(brain==='ready'||brain==='running')&&<div className="buttons"><button className="primary" disabled={brain!=='ready'} onClick={()=>speak('npc')}>NPC speaks</button><button disabled={brain!=='ready'} onClick={()=>speak('dm')}>Ask the DM</button></div>}{reply&&<div className="generated"><h3>{speaker.toUpperCase()} · NON-CANON</h3><p>{reply}</p>{receipt&&<details><summary>Model receipt</summary><pre>{JSON.stringify(receipt,null,2)}</pre></details>}</div>}<a href={SDK_URL} target="_blank" rel="noreferrer">Inspect SDK candidate ↗</a></div></section>
<div className="section"><span>THE CANON LEDGER</span><span>{game.ledger.length} ENTRIES · LOCAL</span></div><section className="panel ledger"><p>Only validated player actions enter the chronicle. Generated text cannot silently rewrite reality.</p><ol>{[...game.ledger].reverse().slice(0,9).map(e=><li key={e.id}><span>#{e.id}</span><div>{e.message}<small>{e.type.toUpperCase()} · {places[e.place].name}</small></div></li>)}</ol></section></main><footer><span>MYTHSPLICER · BELLWEATHER CHRONICLE</span><span>MIT · LEDGER ABOVE EGO</span><a href="https://github.com/MichaelWave369/MythSplicer" target="_blank" rel="noreferrer">SOURCE ↗</a></footer></div>;
}
