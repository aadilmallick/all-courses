"""Assemble canonical chapter text, then add authored part introductions and end matter."""
from pathlib import Path
from assemble_textbook import assemble
root=Path(__file__).resolve().parents[1]
output=assemble(root)
s=output.read_text()
introductions={
'I. Language and linear structure':'We begin by specifying what an equation claims. Vectors then give inputs a geometry, matrices organize linear relationships, and their decompositions reveal which directions contain information. These ideas will reappear as gradients, covariance, regression, and numerical sensitivity.',
'II. Change, accumulation, and optimization':'A model changes when its inputs or parameters move. Limits make that statement precise; derivatives build local approximations; integrals recover accumulated quantities. Combining derivatives with matrix geometry yields backpropagation and optimization rules whose assumptions can be checked.',
'III. Uncertainty and inference':'Arithmetic alone cannot say how representative a finite dataset is. Probability describes uncertain outcomes and their dependencies. Sampling theory connects averages to populations, while inference makes parameter uncertainty explicit. We keep observation noise, estimator variability, and model assumptions separate.',
'IV. Mathematical machine learning':'The final part follows complete models through representation, forward prediction, loss construction, differentiation, fitting, and evaluation. The same mathematical chain supports linear regression, classification, and neural networks, while generalization and stable arithmetic establish the limits of a successful training calculation.'}
for part,intro in introductions.items():s=s.replace(f'# {part}\n',f'# {part}\n\n{intro}\n',1)
s=s.replace('## Contents\n','## Contents\n\n- [References and provenance](#references)\n- [Optional projects](#projects)\n- [Glossary and proof guide](#glossary)\n',1)
for anchor,title,filename in [('references','References and provenance','references.md'),('projects','Optional projects','PROJECTS.md'),('glossary','Glossary and proof guide','GLOSSARY.md')]:
 text=(root/filename).read_text();text='\n'.join(text.splitlines()[1:]);s+=f'\n<a id="{anchor}"></a>\n# {title}\n'+text+'\n'
output.write_text(s)
print(output)
