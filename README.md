# OST Whiteboard (AI-powered)

An interactive whiteboard for building **Opportunity Solution Trees (OSTs)**.

- Generate an OST using **AI (ChatGPT 5.2)** from a problem statement + context
- Edit or paste **OST JSON**
- Visualize the OST as a **vertical** diagram with auto-fit nodes
- Pan/zoom the canvas

➡️ For system design and technical details, see **ARCHITECTURE.md**.

## Getting Started

```bash
npm install
npm run dev
```

Open: http://localhost:5173

## Using AI Generation

1. Enter your **OpenAI API key** (stored in browser `localStorage`)
2. Paste customer problem + project context (and/or upload a `.txt` file)
3. Click **Generate OST**
4. Review / edit the generated JSON
5. Click **Render JSON** to update the diagram

⚠️ This prototype calls OpenAI directly from the browser. Do not use this approach in production without a backend proxy.
