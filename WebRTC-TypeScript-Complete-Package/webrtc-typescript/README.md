# WebRTC in TypeScript: From First Packets to Production

An original, prerequisite-first guide, complete curriculum, ten-chapter Markdown textbook, and local browser learning companion.

Start with [guide.md](guide.md) for the learning strategy, [curriculum.md](curriculum.md) for the lesson sequence, or [book.md](book.md) for the continuous textbook. Individual chapters live in [chapters](chapters/01-foundations.md). [research-resources.md](research-resources.md) explains the selected external resources and their limitations.

## Run the companion

Use Node **24.22.1**, the tested build/runtime baseline. No npm installation is required: the core project has no third-party package dependencies.

```bash
npm run build
npm start
```

Open **http://localhost:4173**. The included `companion/dist` is already built; rebuilding is necessary after source changes. The server listens only on the local machine. On Windows PowerShell, use `$env:WEBRTC_LAB_PORT = '4174'` before `npm start` if you need another port. Both tabs must use the same origin and browser profile.

1. Select **Start local call**. A generated canvas video travels between two real peers without a camera or external ICE servers.
2. Wait for the channel-open log, send text, and transfer a bounded synthetic payload. The receiver checks its SHA-256 digest.
3. Inspect SDP and live stats; change the video bitrate ceiling. A ceiling is not a promise to generate that exact rate.
4. For two-tab mode, Stop the local call. Open the same address in a second tab. Use the same room, role A in one tab and B in the other, then Join in each. Try Simultaneous offers and Restart ICE.
5. Camera and screen buttons require browser permission and capability. The lab captures **no microphone**. Stop/reset releases owned media and peer resources.
6. Use the topology calculator to compare a stated mesh/SFU bandwidth model. It does not operate an SFU.

## Source and verification

- Canonical browser source: `companion/src/*.ts`.
- Build and local server: `scripts/build.mjs`, `companion/server.mjs`.
- Pure calculations, mocked control behavior, transfer tests: `npm test`.
- Optional advanced example: `examples/passthrough-worker.js`, which does not add encryption.
- Backend helper: `examples/turn-credentials.mjs`; never put its shared secret in browser code.
- Optional LiveKit integration is documentation-checked in Chapter 9 and is not installed or connected by this package.

The build strips erasable TypeScript annotations; it **does not type-check**. A conventional strict `tsconfig.json` is included for an independently installed TypeScript compiler. No compiler or external SDK was downloaded here, and there is no dependency lockfile because the core has no package dependencies.

An optional native-browser runner is included in `scripts/browser-smoke.py`, with its separate pinned requirement in `requirements-browser-test.txt`. It requires a separately installed Playwright browser and a running lab server; it was not completed in this environment. Both tabs should reset before pairing again after a tab is replaced.

See [verification.md](verification.md) for the exact checks and material limitations. Browser launch was blocked by this authoring environment, so native peer traffic, playback, permissions, responsive rendering, TURN, and SFU operation were not runtime-verified here. The package is runnable source and built output, not a hosted service or a claim of cross-browser certification.

Markdown readers need Mermaid and math support to render diagrams and equations. Source remains readable without those extensions. Chapter and section links use stable anchors in the continuous book.
