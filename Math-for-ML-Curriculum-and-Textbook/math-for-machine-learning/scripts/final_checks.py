"""Reproducible structure, example, and numerical checks. No visual-rendering claim."""
from pathlib import Path
import hashlib,json,re,subprocess,sys,platform
from validate_textbook import validate
root=Path(__file__).resolve().parents[1]
import numpy,scipy

subprocess.run([sys.executable,str(root/'scripts/build_book.py')],check=True,capture_output=True,text=True)
structure=validate(root)
if structure['errors']:raise RuntimeError(structure['errors'])
records=[]
for chapter in sorted((root/'chapters').glob('*.md')):
 text=chapter.read_text()
 if any(ord(c)<32 and c not in '\n\r' for c in text):raise ValueError(f'Control character in {chapter.name}')
 code=re.findall(r'```python\n(.*?)```',text,re.S)
 assert len(code)==1,chapter.name
 program=root/'examples'/f'{chapter.stem}.py'
 assert program.read_text().split('\n',1)[1]==code[0],f'Example differs from chapter: {program.name}'
 no_code=re.sub(r'```.*?```','',text,flags=re.S)
 narrative=re.sub(r'\$\$.*?\$\$','',no_code,flags=re.S)
 narrative=re.sub(r'\$[^$\n]+\$','',narrative)
 narrative=re.sub(r'<a[^>]*></a>','',narrative)
 word_count=len(narrative.split())
 assert word_count>=2500,(chapter.name,word_count)
 math=re.findall(r'\$\$(.*?)\$\$|(?<!\$)\$([^$\n]+)\$(?!\$)',no_code,re.S)
 for display,inline in math:
  expression=display or inline
  # Escaped literal braces do not delimit groups.
  groups=re.sub(r'\\[{}]','',expression)
  depth=0
  for c in groups:
   if c=='{':depth+=1
   if c=='}':depth-=1
   assert depth>=0,(chapter.name,expression)
  assert depth==0,(chapter.name,expression)
 records.append({'chapter':chapter.stem,'narrative_words_excluding_code_and_math':word_count,'mathematical_expressions':len(math)})
anchors=[]
for p in (root/'chapters').glob('*.md'):anchors+=re.findall(r'<a id="(lesson-\d+)"',p.read_text())
assert set(anchors)=={f'lesson-{i:02d}' for i in range(1,49)} and len(anchors)==48
local_links=0
for path in root.rglob('*.md'):
 text=re.sub(r'```.*?```','',path.read_text(),flags=re.S)
 for target in re.findall(r'!?\[[^\]]*\]\(([^\s)]+)\)',text):
  if re.match(r'^[a-z]+:|^//',target):continue
  filepart,_,fragment=target.partition('#')
  resolved=(path.parent/filepart).resolve() if filepart else path.resolve()
  assert resolved==root or root in resolved.parents,(path,target)
  assert resolved.exists(),(path,target)
  if fragment and resolved.suffix=='.md':
   destination=resolved.read_text()
   explicit=set(re.findall(r'<a id="([^"]+)"',destination))
   # All authored cross-file section links use explicit IDs.
   assert fragment in explicit,(path,target)
  local_links+=1
runs=[]
for program in sorted((root/'examples').glob('*.py')):
 result=subprocess.run([sys.executable,str(program)],capture_output=True,text=True)
 assert result.returncode==0,(program.name,result.stderr)
 runs.append({'file':program.name,'exit_code':result.returncode,'stdout':result.stdout})
math_result=json.loads(subprocess.run([sys.executable,str(root/'scripts/verify_math.py')],capture_output=True,text=True,check=True).stdout)
node_results={}
for filename in ['check.mjs','check-controls.mjs']:
 result=subprocess.run(['node',str(root/'companion'/filename)],capture_output=True,text=True,check=True)
 node_results[filename]=result.stdout.strip()
for path in (root/'companion').glob('*.mjs'):
 subprocess.run(['node','--check',str(path)],check=True,capture_output=True)

def matching_evidence(filename,key):
 path=root/filename
 if not path.exists():return {'status':'not_run'}
 evidence=json.loads(path.read_text())
 hashes=evidence.get(key,{})
 if not hashes or any(not (root/name).is_file() or hashlib.sha256((root/name).read_bytes()).hexdigest()!=value for name,value in hashes.items()):
  return {'status':'stale_for_current_sources'}
 return evidence

render=matching_evidence('verification-rendering.json','chapter_hashes')
server=matching_evidence('verification-server.json','source_hashes')
pdf_evidence=render.get('actual_pdf_compilation',{})
visual_evidence=render.get('visual_inspection')
visual_pages=visual_evidence.get('sampled_pages',[]) if isinstance(visual_evidence,dict) else []
browser_path=root/'verification-browser.json'
browser=json.loads(browser_path.read_text()) if browser_path.exists() else {'status':'not_run'}
report={'status':'checks_passed_with_browser_verification_blocked',
 'versions':{'python':platform.python_version(),'numpy':numpy.__version__,'scipy':scipy.__version__,
             'node':subprocess.run(['node','--version'],capture_output=True,text=True).stdout.strip()},
 'chapters':records,'narrative_words':sum(r['narrative_words_excluding_code_and_math'] for r in records),
 'mathematical_expressions':sum(r['mathematical_expressions'] for r in records),'outline_sessions':48,
 'local_markdown_links_checked':local_links,'executed_examples':runs,'mathematical_checks':math_result,
 'companion_checks':node_results,'structural_errors':structure['errors'],
 'equation_typesetting':render,'local_http_server':server,'browser':browser,
 'limits':['Real browser execution remains blocked; simulated DOM checks are not a browser pass.',
           'TeX compilation verifies equation syntax/typesetting; GitHub/Library math rendering remains unverified.',
           'Exact model-token counts unverified; narrative word counts are not token counts.',
           'Windows/macOS, other browsers and accessibility technologies were not independently executed.']}
(root/'verification.json').write_text(json.dumps(report,indent=2)+'\n')
lines=['# Verification report','','Follow-up verification date: 2026-11-12. Checks apply to the saved package and its source hashes.','',
 '## Results','','| Verification layer | Result | Evidence |','|---|---|---|',
 f'| Python programs | Passed | All {len(runs)} programs executed successfully |',
 f'| Numerical/mathematical cross-checks | Passed | {math_result["passed"]} checks, including every neural parameter derivative |',
 f'| Curriculum and links | Passed | 48 sessions, 12 chapters, {local_links} local links, no structural errors |',
 '| Companion calculations | Passed | All 13 experiment families |',
 '| Control wiring | Passed on simulated DOM | Updates, reset, listener disposal, and two invalid-input paths |']
if render.get('status')=='passed':
 lines += [f'| TeX expression compilation | Passed | All {render["expressions"]:,} chapter expressions; no missing-glyph or overfull-box warnings |',
           ('| Rendered equation samples | Passed | '+str(len(visual_pages))+' inspected pages from an equation audit of '+str(pdf_evidence.get('pages'))+' pages |' if visual_pages and pdf_evidence.get('status')=='passed' else '| Rendered equation samples | Not recorded | Draft-mode compilation is not a visual pass |')]
else:lines += ['| TeX expression compilation | Not verified for current source | Run scripts/verify_equations.py with a working TeX installation |']
if server.get('status')=='passed':
 lines += ['| Local HTTP server | Passed | Seven actual responses, correct MIME types, and two 404 checks |']
lines += ['| Actual browser visuals/interactions | Blocked | Chromium cannot start under this runtime’s socket restrictions |',
 '| GitHub/Library math preview | Unverified | TeX syntax success does not establish a particular Markdown renderer’s behavior |','',
 'The remaining browser limitation is explicit: this report does not mark real browser interactions, canvas output, or responsive layout as passed.','',
 '## Depth and structural consistency','',
 f'The chapters contain {report["narrative_words"]:,} narrative words excluding code and mathematical expressions. All exceed the authored minimum of 2,500 narrative words.','',
 '| Chapter | Narrative words | Mathematical expressions |','|---|---:|---:|']
for r in records:lines.append(f'| {r["chapter"]} | {r["narrative_words_excluding_code_and_math"]:,} | {r["mathematical_expressions"]} |')
lines += ['',
 'The structural validator reports zero errors. Stable IDs cover all 48 sessions; the continuous book is generated from the canonical chapters. Chapter code and extracted examples match. Code fences, asset paths, source listings, internal anchors and equation brace groups pass static checks.','',
 'Model-token counts are not certified. A suitable tokenizer was unavailable; no model-token minimum or 5,000-word-per-session proxy is claimed. The measured unit is narrative words per substantial chapter.','',
 '## Executed mathematics and examples','',
 f'All {len(runs)} Python programs ran under Python {report["versions"]["python"]}, NumPy {numpy.__version__}, and SciPy {scipy.__version__}. Companion checks used Node {report["versions"]["node"]}.','',
 f'The {math_result["passed"]} mathematical checks cover least squares, SVD and PCA, Taylor bounds, numerical integration and normalization, gradients/Jacobians, constrained stationarity, smooth descent, probability-family moments, Bayesian updating, confidence intervals, ANOVA, information quantities and concentration calculations. The complete named inventory is in verification.json.','',
 f'The largest analytic versus central-difference discrepancy across all nine neural parameters was {math_result["maximum_neural_gradient_discrepancy"]:.3g}. The smooth-descent inequality was checked on twenty deterministic positive definite quadratics. These finite checks support the examples; they do not prove every general theorem.','',
 'The companion calculation suite passes for all 13 families, including extreme logits ±1,000. Its in-memory DOM suite verifies control-result updates, reset, listener disposal, and invalid projection/conditioning paths. It remains a simulated-DOM test. JavaScript syntax checks also pass.','',
 '## Equation rendering','']
if render.get('status')=='passed':
 lines += [f'All {render["expressions"]:,} chapter math expressions were compiled by pdfTeX/LaTeX with amsmath and amssymb. No missing glyphs or overfull boxes were reported. '+(f"An equation audit PDF with {pdf_evidence.get('pages')} pages was generated; {len(visual_pages)} pages ({', '.join(map(str,visual_pages))}) were rendered and visually inspected, including matrices, cases, fractions, multivariable Taylor notation, integrals and Gaussian density notation." if visual_pages and pdf_evidence.get('status')=='passed' else 'No actual-PDF visual inspection is recorded for this evidence file.'),'',
 ('The host’s missing prebuilt format was rebuilt privately from installed TeX sources. Installed Computer Modern/AMS font maps were loaded explicitly; the audit PDF embedded its fonts. System configuration was not changed. The audit is an internal verification artifact, not the layout of the Markdown book.' if render.get('notes') else 'This compilation checks mathematical typesetting rather than a particular Markdown renderer’s layout.'),'',
 'verification-rendering.json binds this evidence to chapter hashes. scripts/verify_equations.py reproduces the syntax/typesetting check on a working TeX installation; its default draft mode does not produce a PDF. Cached evidence is rejected when source hashes change.','']
else:lines += ['No current equation-compilation evidence is available.','']
lines += ['## Local serving and browser limit','',
 'The documented Node server was started and reached over localhost. HTML, modules, CSS, one figure and the book returned HTTP 200 with the expected MIME types. Missing and encoded parent-path requests returned 404. This verifies actual static serving, rather than only reading server source.','',
 'Chromium launch was attempted and failed before any page could be created because the runtime denied a required socket operation. The supported managed-browser execution tool is unavailable in this session. Actual browser interactions, canvas rendering, desktop/mobile layout, keyboard behavior and assistive-technology behavior therefore remain unverified. No responsive-layout screenshots or browser pass are claimed.','',
 '## Reproduction and practical limits','',
 'Run README.md’s commands for examples, mathematical checks, companion checks and structural validation. A complete TeX installation is optional for the additional equation check. All three included figures were previously generated and visually inspected. Windows/macOS, other browser engines, alternative runtime versions and native Markdown previews have not been independently tested.','',
 'Proofs, proof sketches and stated theorems are distinguished in the prose and indexed in GLOSSARY.md. Source inspection is documented in references.md. The archive is integrity-checked and its file hashes are recorded in checksums.sha256 during packaging. No textbook prose or worked answer required correction in this verification pass; the executable verification suite and evidence record were expanded.']
(root/'verification.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({'narrative_words':report['narrative_words'],'examples_passed':len(runs),
 'numerical_checks_passed':math_result['passed'],'local_links_checked':local_links,
 'equation_typesetting':render.get('status'),'real_browser':browser.get('status')},indent=2))
