import {readFileSync,writeFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
const base=resolve('node_modules'),paths=[];
for(const d of readdirSync(base,{withFileTypes:true})){if(d.name.startsWith('.'))continue;if(d.name.startsWith('@'))for(const s of readdirSync(resolve(base,d.name)))paths.push(resolve(base,d.name,s));else paths.push(resolve(base,d.name));}
let text='# Third-party notices\n\nThe course prose, examples, exercise data, and original application code were authored for this project. The build uses the following packages. This inventory records installed package notices conservatively; not every package is included in the browser bundle. No third-party French textbook content is redistributed.\n\n';
for(const dir of paths.sort()){const p=resolve(dir,'package.json');if(!existsSync(p))continue;try{const pkg=JSON.parse(readFileSync(p,'utf8'));text+=`## ${pkg.name} ${pkg.version}\n\nLicense metadata: ${typeof pkg.license==='string'?pkg.license:JSON.stringify(pkg.license)||'See package repository'}\n\n`;const license=readdirSync(dir).find(n=>/^(license|licence|copying)(\.|$)/i.test(n));if(license){const data=readFileSync(resolve(dir,license),'utf8');text+='```text\n'+data.replace(/```/g,'~~~')+'\n```\n\n';}}catch{}}
writeFileSync('THIRD-PARTY-NOTICES.md',text);console.log('Dependency notices collected.');
