const assert=require('node:assert/strict'),m=require('./lab-model.js');
assert.equal(m.ease(0,'ease'),0);assert.equal(m.ease(1,'ease'),1);assert.equal(m.ease(.5,'linear'),.5);assert.equal(m.ease(.5,'ease'),.875);
assert.equal(m.scene(0).name,'title');assert.equal(m.scene(2.5).name,'code');assert.equal(m.scene(5).name,'hold');assert.equal(m.scene(8).name,'diagram');assert.equal(m.scene(99).time,12.5);assert.equal(m.scene(6,.5).name,'diagram');assert.equal(m.scene(-1).time,0);assert.equal(m.narration('one two',120,0).seconds,1);assert.equal(m.narration('',150,5).seconds,5);assert.equal([60,75,60,75,30,150,60].reduce((a,b)=>a+b),510);assert.equal([30,150,90,60,60,90,90,120,90,30,90,60,60].reduce((a,b)=>a+b),1020);
console.log('Passed 15 model and schedule assertions.');
