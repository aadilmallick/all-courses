"""Write navigation/manifest from the stable chapter and outline mapping."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]
chapters=sorted((root/'chapters').glob('*.md'))
topics=[
 ['Functions, inputs, parameters, and models','Sets, logic, quantifiers, and proof methods','Sums, products, indices, and notation','Powers, exponentials, and logarithms'],
 ['Coordinates, vectors, and operations','Linear combinations, span, and independence','Bases, dimension, and changing coordinates','Dot products, trigonometry, and projections'],
 ['Matrices as functions and multiplication','Linear systems and elimination','Rank, null spaces, invertibility, and identifiability','Norms, orthogonality, and least squares'],
 ['Eigenvalues and eigenvectors','Symmetry, spectral theorem, and quadratic forms','SVD and pseudoinverses','Low rank approximation, PCA, and conditioning'],
 ['Sequences, limits, continuity, and convergence','Derivatives as local linear approximations','Product, quotient, and chain rules','Higher derivatives, Taylor approximations, and errors'],
 ['Integrals as accumulated quantities','Fundamental theorem of calculus','Substitution and integration by parts','Improper/multiple integrals and changes of variables'],
 ['Partials, directional derivatives, and total differentiability','Gradients and steepest ascent','Jacobians, composition, and backpropagation','Hessians, multivariable Taylor expansions, matrix derivatives'],
 ['Minima, stationarity, and curvature','Convexity and global optimality','Gradient descent, step sizes, and convergence','Constraints, Lagrange multipliers, KKT, Newton, stochastic updates'],
 ['Outcomes, events, counting, and probability axioms','Conditioning, independence, total probability, and Bayes','Random variables, masses, densities, and CDFs','Expectation, variance, covariance, and conditional expectation'],
 ['Bernoulli, binomial, geometric, and Poisson','Uniform, exponential, gamma, and beta','Gaussian, multivariate Gaussian, chi-squared, t, and F','Sampling, LLN, CLT, and concentration'],
 ['Estimators, bias, variance, consistency, and identifiability','Likelihood, MLE, and MAP','Bayesian updating and predictive distributions','Confidence intervals, tests, bootstrap, correlation, and ANOVA'],
 ['Linear regression, Gaussian noise, ridge, and bias–variance','Logistic/softmax, entropy, cross-entropy, KL, and mutual information','A complete neural forward and backward pass','Generalization, numerical stability, and synthesis']]
outcomes=[
 ['Distinguish a model family, prediction, and loss','Audit a statement and construct a short proof','Expand indexed formulas and check shapes','Derive log identities and a stable exponential sum'],
 ['Represent feature inputs and explain scaling','Determine expressible directions and redundant coefficients','Recover coordinates in an alternative basis','Derive the closest point on a line'],
 ['Interpret a matrix as a composed transformation','Solve and classify small systems','Explain retained and invisible parameter directions','Derive and numerically check a least squares fit'],
 ['Calculate invariant directions and powers','Interpret eigenvalues as signed curvature','Construct an SVD and minimum-norm solution','Derive PCA and diagnose sensitive inverses'],
 ['Prove a simple limit and distinguish continuity','Construct and interpret a derivative limit','Derive rules for composed changes','Bound a finite approximation error'],
 ['Construct a total from finite sums','Prove why an antiderivative evaluates an integral','Transform and simplify definite integrals','Normalize a density and apply a volume factor'],
 ['Distinguish coordinate rates from one total derivative','Prove the Euclidean steepest-direction result','Propagate sensitivities through a network','Derive shaped gradients and curvature matrices'],
 ['Classify local candidate points with hypotheses','Prove why convex stationarity is global','Derive a decreasing step and convergence bound','Apply regularity-aware constrained and stochastic methods'],
 ['Specify a probability model and count valid outcomes','Reconstruct joint probabilities and reverse conditioning','Distinguish mass, density, CDF, and transformed distributions','Derive conditional-mean optimality and variance decompositions'],
 ['Choose and derive count/waiting models','Check support, normalization, and rate/scale conventions','Connect Gaussian geometry to sampling distributions','Distinguish finite-sample bounds from asymptotic approximations'],
 ['Separate an estimator from an estimate','Derive likelihood optimizers and a prior penalty','Update conjugate models and predict future outcomes','Interpret intervals/tests and audit resampling assumptions'],
 ['Connect least squares to a full statistical model','Derive classification objectives and information inequalities','Check every derivative of a small neural model','Separate training, selection, test risk, and numerical error']]
experiments=[['model'],['projection'],['least'],['matrix','pca'],['derivative'],['integral'],['backprop'],['descent'],['bayes'],['sampling'],['posterior'],['classifier']]
parts=['I. Language and linear structure']*4+['II. Change, accumulation, and optimization']*4+['III. Uncertainty and inference']*3+['IV. Mathematical machine learning']
manifest={'schema_version':1,'title':'From Equations to Learning','subtitle':'A guided mathematics textbook for machine learning: 48 sessions in 12 complete chapters','audience':'A returning learner with arithmetic and elementary algebra; calculus and linear algebra are rebuilt. Python is optional for the mathematics.','status':'complete','preface':'preface.md','output':'book.md','chapters':[],'assets':['assets/projection.png','assets/curvature.png','assets/densities.png'],'source_listings':[{'id':'neural-source','path':'examples/neural_network.py','title':'Complete neural computation and gradient check','language':'python'},{'id':'capstone-source','path':'examples/end_to_end.py','title':'Complete end-to-end project','language':'python'},{'id':'laboratory-source','path':'companion/core.mjs','title':'Interactive laboratory calculation source','language':'javascript'}],'companion':{'path':'companion','catalog':'companion/catalog.json','run':'node companion/server.mjs','starter':False},'provenance':'sources.json','verification':'verification.md'}
lines=['# Complete curriculum: mathematics for machine learning','', 'The 48 topics from the agreed outline are preserved as guided sessions. Four sessions form one substantial chapter. Read one session at a time; a chapter is a unit of dependency and file organization, not a single sitting. The complete teaching is in the linked chapter, and the same canonical text is assembled into [book.md](book.md).','', 'Start with arithmetic and elementary algebra. Each chapter supplies its new prerequisites. Optional applications have explanations and reference implementations; no quiz or live response is required to continue. A reasonable rhythm is two or three sessions per week, with extra time for the final optimization and synthesis sessions. This is a pacing suggestion, not an estimated completion guarantee.','']
for i,p in enumerate(chapters):
 text=p.read_text();title=text.splitlines()[0].split('. ',1)[1]
 for k in range(4):
  n=4*i+k+1
  # Session 32 is divided into A/B/C, while retaining one outline lesson.
  pattern=rf'(?m)^(## Session {n}(?:[ —A]).*)$'
  if f'id="lesson-{n:02d}"' not in text:
   text,count=re.subn(pattern,lambda m:f'<a id="lesson-{n:02d}"></a>\n'+m.group(1),text,count=1)
   assert count==1,(p,n)
 if '[Curriculum]' not in text:
  nav=[]
  if i:nav.append(f'[Previous chapter]({chapters[i-1].name})')
  nav.append('[Curriculum](../CURRICULUM.md)')
  if i+1<len(chapters):nav.append(f'[Next chapter]({chapters[i+1].name})')
  text=text.rstrip()+'\n\n'+' · '.join(nav)+'\n'
 p.write_text(text)
 manifest['chapters'].append({'id':f'chapter-{i+1:02d}','title':title,'path':str(p.relative_to(root)),'part':parts[i],'status':'complete','minimum_prose_words':2500,'prerequisites':[f'chapter-{i:02d}'] if i else [],'experiments':experiments[i]})
 lines.extend([f'## Chapter {i+1}: {title}','',f'Read: [{p.name}](chapters/{p.name}). Laboratory: '+', '.join(f'`{e}`' for e in experiments[i])+'.','', '| Original lesson | Guided session | Ability developed |','|---|---|---|'])
 for k in range(4):
  n=4*i+k+1;lines.append(f'| {n} | [{topics[i][k]}](chapters/{p.name}#lesson-{n:02d}) | {outcomes[i][k]} |')
 lines.extend(['',f'Prerequisite: '+('the preceding chapter; earlier concepts are used cumulatively.' if i else 'arithmetic, signed numbers, and basic algebra.')+' Practice: use the optional application near the end of the chapter and the mapped experiment.',''])
lines.extend(['## Source-to-curriculum coverage','', '| Source topic family | Full treatment | Deliberate expansion |','|---|---|---|','| Primer vectors and trigonometry | Chapters 2–4 | Bases, rank, SVD, PCA, numerical conditioning |','| Primer differential calculus | Chapters 5, 7–8 | Limit definitions, proofs, error bounds, constraints, convergence |','| Integrals needed for continuous distributions | Chapter 6 | FTC, normalization, multidimensional transformations |','| Primer probability families | Chapters 9–10 | Conditional expectation, multivariate geometry, concentration |','| Primer inference and regression | Chapters 11–12 | Estimator theory, uncertainty interpretation, regularization, generalization |','','See [references.md](references.md) for exact inspection status. This is an original textbook based on the agreed topic outline, not a reproduction of the primer.','', '## Dependency structure','', 'Language and vectors support matrix geometry. Limits and derivatives build on functions and algebra; integration provides normalization and expectation. Multivariable calculus combines local approximation with matrices. Optimization uses derivatives and curvature. Probability then supplies the distributional model for inference; the final chapter combines all branches.','', 'Full measure theory, generalization bounds for arbitrary neural architectures, causal identification, stochastic differential equations, and graduate asymptotic theory are follow-on subjects. Major results whose full proofs need those tools are labeled as stated theorems or proof sketches.'])
(root/'CURRICULUM.md').write_text('\n'.join(lines)+'\n')
(root/'book.json').write_text(json.dumps(manifest,indent=2)+'\n')
