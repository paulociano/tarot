import test from 'node:test';
import assert from 'node:assert/strict';
import {readingArtwork} from './reading-art.js';
test('symbolic artwork does not include paintings or private content',()=>{const svg=readingArtwork([{id:'18-a-lua',reversed:false},{id:'19-o-sol',reversed:true}]);assert.match(svg,/A Lua/);assert.match(svg,/O Sol/);assert.match(svg,/Invertida/);assert.match(svg,/data-node-count="2"/);assert.doesNotMatch(svg,/<image\b|https?:\/\/.*assets\/|<script\b/);assert.throws(()=>readingArtwork([]));assert.throws(()=>readingArtwork([{id:'invalid',reversed:false}]))});
