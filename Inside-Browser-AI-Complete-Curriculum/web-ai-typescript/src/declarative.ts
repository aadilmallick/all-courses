import { searchNotes } from './webmcp.ts';

interface AgentSubmitEvent extends SubmitEvent {
  agentInvoked?: boolean;
  respondWith?: (result: Promise<unknown>) => void;
}

// Ordinary form behavior works without WebMCP; experimental annotations are additive.
export function mountDeclarativeSearch(parent: HTMLElement): () => void {
  const form = document.createElement('form');
  form.setAttribute('toolname', 'search_notes_form');
  form.setAttribute('tooldescription', 'Search public course notes. Returns excerpts; does not modify data.');
  form.setAttribute('toolautosubmit', '');
  const label = document.createElement('label');
  label.textContent = 'Declarative form query';
  const input = document.createElement('input');
  input.name = 'query'; input.required = true; input.maxLength = 200;
  input.setAttribute('toolparamdescription', 'Terms to search in public course notes.');
  label.append(input);
  const submit = document.createElement('button'); submit.type = 'submit'; submit.textContent = 'Search through form';
  const output = document.createElement('pre'); output.setAttribute('aria-live', 'polite');
  form.append(label, submit, output); parent.append(form);
  const listener = (event: SubmitEvent) => {
    event.preventDefault();
    const agentEvent = event as AgentSubmitEvent;
    const promise = Promise.resolve().then(() => {
      if (!form.checkValidity()) throw new TypeError('Invalid form.');
      return searchNotes({ query: new FormData(form).get('query') });
    });
    if (agentEvent.agentInvoked && agentEvent.respondWith) agentEvent.respondWith(promise);
    void promise.then(result => { output.textContent = JSON.stringify(result, null, 2); }).catch(error => { output.textContent = error instanceof Error ? error.message : String(error); });
  };
  form.addEventListener('submit', listener);
  return () => { form.removeEventListener('submit', listener); form.remove(); };
}
