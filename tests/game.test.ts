import {describe,it,expect} from 'vitest';
import {begin,resolve,d20,validSave} from '../src/game';
describe('canonical game',()=>{
it('has a valid initial state',()=>{const g=begin();expect(validSave(g)).toBe(true);expect(g.ledger).toHaveLength(1);});
it('refuses inaccessible destinations',()=>{const g=begin();expect(()=>resolve(g,{type:'travel',to:'square'})).toThrow();expect(g.turn).toBe(0);});
it('never duplicates clues',()=>{const g=resolve(begin(),{type:'examine'});expect(resolve(g,{type:'examine'}).clues).toHaveLength(1);});
it('does not let NPCs talk from other places',()=>expect(()=>resolve(begin(),{type:'talk',npc:'osric'})).toThrow());
it('rolls bounded deterministic dice',()=>{for(let i=1;i<100;i++){expect(d20(369,i)).toBeGreaterThanOrEqual(1);expect(d20(369,i)).toBeLessThanOrEqual(20);}});
it('does not mutate old relationship state',()=>{const g=begin();const next=resolve(g,{type:'talk',npc:'mara'});expect(g.affinity.mara).toBe(0);expect(next.affinity.mara).toBe(1);});
it('rejects malformed saved event sets',()=>expect(validSave({...begin(),ledger:[]})).toBe(false));
});
