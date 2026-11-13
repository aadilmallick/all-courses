// event-loop.mjs
const started = performance.now();
setTimeout(() => {
  console.log('timer after', Math.round(performance.now() - started), 'ms');
}, 0);

const deadline = performance.now() + 80;
while (performance.now() < deadline) {
  // Deliberately busy for a small demonstration only.
}
console.log('loop finished');
