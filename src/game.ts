/** The game owns canon. Models can suggest or narrate but never mutate it. */
export type Place='square'|'inn'|'tower';
export type Npc='mara'|'osric'|'thimble';
export type Action={type:'travel';to:Place}|{type:'examine'}|{type:'talk';npc:Npc}|{type:'roll'};
export type Entry={id:number;type:Action['type'];place:Place;message:string;die?:number};
export type Game={schema:'MYTHSPLICER_V1';seed:number;turn:number;place:Place;visited:Place[];clues:string[];affinity:Record<Npc,number>;ledger:Entry[]};
export const places:Record<Place,{name:string;label:string;scene:string;paths:Place[];clue:string;finding:string}>={
square:{name:'Lantern Square',label:'BELLWEATHER / CENTRAL WARD',scene:'Copper lanterns sway above rain-polished stone. Thirteen nights ago, the town clock stopped. Nobody will say why.',paths:['inn','tower'],clue:'Silver wire binds the clock hand.',finding:'You discover a silver wire wound tightly around the frozen minute hand.'},
inn:{name:'The Copper Kettle',label:'BELLWEATHER / EAST WARD',scene:'Amber light falls across quiet tables. A battered ledger rattles under the innkeeper’s counter.',paths:['square'],clue:'A page is missing from the inn ledger.',finding:'You discover a ledger page was removed on the thirteenth night.'},
tower:{name:'The Thirteenth Tower',label:'BELLWEATHER / NORTH ROAD',scene:'Stopped gears loom overhead. Behind an iron door you hear a careful tapping, three knocks followed by one.',paths:['square'],clue:'The tower’s knocks form a deliberate three-one signal.',finding:'You listen closely. The three-one signal repeats with mechanical precision.'}
};
export const npcs:Record<Npc,{name:string;job:string;place:Place;traits:string;first:string;again:string}>={
mara:{name:'Mara Finch',job:'Clockmaker',place:'square',traits:'precise, skeptical, quietly kind',first:'“The tower is not broken,” Mara says. “It is waiting.”',again:'“Trust what the mechanism tells you, not the rumors.”'},
osric:{name:'Osric Vale',job:'Innkeeper',place:'inn',traits:'warm, secretive, observant',first:'“A hooded visitor came in thirteen nights ago. Paid in old coins.”',again:'“The ledger remembers more than I will admit.”'},
thimble:{name:'Thimble',job:'Courier',place:'tower',traits:'playful, brave, curious',first:'“A ghost with a clock? That’s no ghost. Ghosts have dreadful timing.”',again:'“Three knocks, then one. Sounds like a question to me!”'}
};
export const begin=(seed=369):Game=>({schema:'MYTHSPLICER_V1',seed:seed>>>0,turn:0,place:'square',visited:['square'],clues:[],affinity:{mara:0,osric:0,thimble:0},ledger:[{id:0,type:'travel',place:'square',message:'Your chronicle begins in Bellweather.'}]});
export function d20(seed:number,turn:number){let x=(seed^Math.imul(turn,0x9e3779b9))>>>0;x^=x>>>16;x=Math.imul(x,0x7feb352d)>>>0;x^=x>>>15;x=Math.imul(x,0x846ca68b)>>>0;x^=x>>>16;return ((x>>>0)%20)+1;}
export function resolve(game:Game,action:Action):Game{
let place=game.place,visited=[...game.visited],clues=[...game.clues],affinity={...game.affinity},message='',die:number|undefined;
switch(action.type){
case 'travel':if(!places[place].paths.includes(action.to))throw Error('Unreachable location');place=action.to;if(!visited.includes(place))visited.push(place);message='You enter '+places[place].name+'.';break;
case 'examine':message=clues.includes(places[place].clue)?'You have already discovered this clue.':places[place].finding;if(!clues.includes(places[place].clue))clues.push(places[place].clue);break;
case 'talk':{const npc=npcs[action.npc];if(npc.place!==place)throw Error('Character not present');message=affinity[action.npc]?npc.again:npc.first;affinity[action.npc]=Math.min(3,affinity[action.npc]+1);break;}
case 'roll':die=d20(game.seed,game.turn+1);message='The twenty-sided die lands on '+die+'. No state changes without a validated action.';break;
}
const entry:Entry={id:game.turn+1,type:action.type,place,message};if(die!==undefined)entry.die=die;
return {...game,turn:game.turn+1,place,visited,clues,affinity,ledger:[...game.ledger,entry]};
}
export function validSave(value:unknown):value is Game{
if(!value||typeof value!=='object')return false;const v=value as Partial<Game>;
return v.schema==='MYTHSPLICER_V1'&&Number.isSafeInteger(v.seed)&&Number.isSafeInteger(v.turn)&&typeof v.place==='string'&&Object.hasOwn(places,v.place)&&Array.isArray(v.visited)&&v.visited.every(p=>typeof p==='string'&&Object.hasOwn(places,p))&&Array.isArray(v.clues)&&v.clues.every(s=>typeof s==='string')&&!!v.affinity&&(['mara','osric','thimble'] as Npc[]).every(id=>Number.isInteger(v.affinity?.[id]))&&Array.isArray(v.ledger)&&v.ledger.length===(v.turn??-1)+1&&v.ledger.every((e,i)=>e&&e.id===i&&typeof e.message==='string');
}
