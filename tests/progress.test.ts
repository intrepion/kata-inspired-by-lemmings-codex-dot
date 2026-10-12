import {test} from 'node:test';
import assert from 'node:assert/strict';
import {decodeProgress} from '../src/progress.ts';
test('corrupt or foreign progress returns an empty campaign',()=>{
 for(const raw of ['broken','null','{"version":2,"best":[5]}','{"version":1,"best":"oops"}'])assert.deepEqual(decodeProgress(raw),[0,0,0,0,0,0]);
});
test('bounded best results cannot unlock through a corrupt sequence',()=>{
 assert.deepEqual(decodeProgress('{"version":1,"best":[5,99,5,6,5,6]}'),[5,0,0,0,0,0]);
 assert.deepEqual(decodeProgress('{"version":1,"best":[5,5,5,6,5,6]}'),[5,5,5,6,5,6]);
});
