// Optional encoded-transform experiment. This forwards frames; it does not encrypt.
self.addEventListener('rtctransform', event => {
  const transformer = event.transformer;
  transformer.readable.pipeThrough(new TransformStream({
    transform(frame, controller) { controller.enqueue(frame); }
  })).pipeTo(transformer.writable).catch(error => {
    self.postMessage({ type: 'error', message: String(error) });
  });
});
