"""Compare browser-engine mathematics with independent NumPy calculations.

Also execute every joint endpoint/select combination in the experiment catalog.
This checks numerical behavior under Node, not browser layout or rendering.
"""
from pathlib import Path
import itertools,json,subprocess
import numpy as np
root=Path(__file__).resolve().parents[1]
rng=np.random.default_rng(20261112)
fixtures=[];expected=[]
for index in range(20):
    query=rng.normal(size=2);keys=rng.normal(size=(3,2));values=rng.normal(size=(3,4));temperature=float(rng.uniform(.2,3))
    allowed=np.array([True,index%2==0,index%3==0])
    scores=keys@query/(np.sqrt(2)*temperature);scores=np.where(allowed,scores,-np.inf)
    weights=np.exp(scores-np.max(scores));weights/=weights.sum()
    fixtures.append({'kind':'attention','args':[query.tolist(),keys.tolist(),values.tolist(),allowed.tolist(),temperature]})
    expected.append({'weights':weights.tolist(),'output':(weights@values).tolist()})
for gamma in [0.,.5,.9,.98]:
    for reward in [-1.,1.7]:
        transition=np.array([[.7,.3],[.2,.8]])
        exact=np.linalg.solve(np.eye(2)-gamma*transition,[reward,0])
        fixtures.append({'kind':'bellman','args':[gamma,reward,150]});expected.append({'exact':exact.tolist()})
for gap,reference,beta in [(-6,6,2),(.2,-.1,.4),(6,-6,.1),(0,0,1)]:
    delta=gap-reference
    fixtures.append({'kind':'dpo','args':[gap,reference,beta]})
    expected.append({'loss':float(np.logaddexp(0,-beta*delta)),'gradient':float(-beta/(1+np.exp(beta*delta)))})
for lam in [0.,.5,.95,1.]:
    residual=np.array([.9*.3-.2,.9*.4-.3,1-.4])
    advantage=[sum((.9*lam)**j*residual[i+j] for j in range(3-i)) for i in range(3)]
    fixtures.append({'kind':'gae','args':[lam]});expected.append({'advantages':advantage})
program='''
import fs from 'node:fs';
import * as engine from MODULE;
const fixtures=JSON.parse(fs.readFileSync(0,'utf8'));
const results=fixtures.map(f=>engine[f.kind](...f.args));
const catalog=JSON.parse(fs.readFileSync(CATALOG,'utf8'));
let corners=0;
function inspect(value){if(typeof value==='number'&&!Number.isFinite(value))throw new Error('Nonfinite corner result');if(value&&typeof value==='object')for(const child of Object.values(value))inspect(child);}
for(const entry of catalog.experiments){
 const choices=entry.controls.map(c=>c.options||(c.type==='text'?['current service port','backup daily','unknown']: [c.min,c.max]));
 const visit=(index,parameters)=>{if(index===entry.controls.length){inspect(engine.calculate(entry.id,parameters));corners++;return;}for(const value of choices[index])visit(index+1,{...parameters,[entry.controls[index].name]:value});};
 visit(0,{});
}
console.log(JSON.stringify({results,corners}));
'''.replace('MODULE',json.dumps((root/'companion/engine.js').as_uri())).replace('CATALOG',json.dumps(str(root/'companion/catalog.json')))
process=subprocess.run(['node','--input-type=module','-e',program],input=json.dumps(fixtures),text=True,capture_output=True,check=True,timeout=30)
output=json.loads(process.stdout)
for index,(actual,reference) in enumerate(zip(output['results'],expected)):
    for key,answer in reference.items():
        assert np.allclose(actual[key],answer,atol=1e-10,rtol=1e-10),(index,key,actual[key],answer)
print(json.dumps({'numpy_javascript_fixtures_passed':len(fixtures),'joint_control_corners_passed':output['corners'],'browser_rendering_exercised':False},indent=2))
