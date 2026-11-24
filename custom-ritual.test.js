import test from 'node:test';
import assert from 'node:assert/strict';
import {validCustom,snapshot,layoutCells,validTemplates} from './custom-ritual.js';
import {draw,interpret,validRecord,validSession} from './engine.js';
import {importJournal} from './storage.js';
import {oracleReading} from './oracle.js';
const def={name:'Espelho',layout:'circle',positions:['Origem','Recurso','Integração'],lens:['Considere','Observe','Explore']};test('definition validation and stable snapshot',()=>{assert.ok(validCustom(def));assert.equal(validCustom({...def,positions:[]}),false);assert.equal(validCustom({...def,layout:'unknown'}),false);const copy=snapshot(def);copy.positions[0]='Nova';assert.equal(def.positions[0],'Origem');assert.equal(validTemplates([{id:'a',definition:def},{id:'a',definition:def}]).length,1);for(let n=3;n<=10;n++)assert.equal(new Set(layoutCells(n,'circle').map(x=>x.join(','))).size,n)});
test('custom reading preserves positions, journal and oracle',()=>{const record={id:'a',date:'2026-11-24T12:00:00Z',spread:'custom',customSpread:snapshot(def),topic:'general',question:'',note:'',items:draw(3),chat:[]};assert.ok(validRecord(record));assert.ok(validSession({...record,mode:'manual',revealed:3}));assert.equal(interpret(record.items,'custom','general',record.customSpread).cards[0].position,'Origem');assert.match(oracleReading(record).narrative,/Origem/);assert.deepEqual(importJournal(JSON.stringify([record]),[]).records[0].customSpread,def);assert.equal(validRecord({...record,customSpread:null}),false)});
