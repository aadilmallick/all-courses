// Syntax verification, not proof of the equations' mathematical truth.
// Usage: node checks/quantum_math_render.cjs [absolute-path-to-katex.js]
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const katex=require(path.resolve(process.argv[2]||path.join(root,'companion/vendor/katex/dist/katex.js')));
let total=0;
const errors=[];
for(const dir of ['chapters','solutions']){
  for(const file of fs.readdirSync(path.join(root,dir)).filter(x=>/^2[0-6]-.*\.md$/.test(x))){
    const s=fs.readFileSync(path.join(root,dir,file),'utf8');
    for(const m of s.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$/g)){
      try{
        katex.renderToString(m[1]??m[2],{throwOnError:true,displayMode:m[1]!==undefined,strict:'ignore'});
        total++;
      }catch(e){errors.push({file,formula:m[1]??m[2],error:e.message});}
    }
  }
}
const report={parsed_equations:total,errors,scope:'KaTeX syntax check only; equations independently reviewed and selected numerical checks in quantum_checks.py.'};
fs.writeFileSync(path.join(__dirname,'quantum-render-results.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(errors.length)process.exitCode=1;
