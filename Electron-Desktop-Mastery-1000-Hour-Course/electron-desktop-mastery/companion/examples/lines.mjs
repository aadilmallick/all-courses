async function* jsonLines(chunks, maxChars = 10000) {
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let pending = '';
  for await (const chunk of chunks) {
    pending += decoder.decode(chunk, { stream: true });
    let boundary;
    while ((boundary = pending.indexOf('\n')) >= 0) {
      const line = pending.slice(0, boundary).replace(/\r$/, '');
      pending = pending.slice(boundary + 1);
      if (line.length > maxChars) throw new Error('LINE_TOO_LARGE');
      if (line.trim()) yield JSON.parse(line);
    }
    if (pending.length > maxChars) throw new Error('LINE_TOO_LARGE');
  }
  pending += decoder.decode();
  if (pending.trim()) {
    if (pending.length > maxChars) throw new Error('LINE_TOO_LARGE');
    yield JSON.parse(pending);
  }
}

const bytes = new TextEncoder().encode('{"text":"café"}\n{"done":true}\n');
async function* chunks() {
  for (let offset = 0; offset < bytes.length; offset += 3) {
    yield bytes.slice(offset, offset + 3);
  }
}
for await (const event of jsonLines(chunks())) console.log(event);
