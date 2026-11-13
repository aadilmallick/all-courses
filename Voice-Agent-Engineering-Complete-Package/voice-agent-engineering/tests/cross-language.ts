import {endpoint} from '../examples/typescript/core.ts';
let input='';for await(const chunk of process.stdin)input+=chunk;
console.log(JSON.stringify(JSON.parse(input).map((value:any)=>endpoint(value.frames,value.silenceMs,value.frameMs))));
