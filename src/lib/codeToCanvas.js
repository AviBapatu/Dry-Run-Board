import { CanvasStateSchema, getGroqJSONSchema } from './schemas.js';

export async function generateCanvasFromCode(codeSnippet, apiKey) {
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  const schemaInstructions = `
Your output MUST be a JSON object with two arrays: "nodes" and "edges".

"nodes" array items:
- id: string (unique)
- type: "arrayNode" | "matrixNode" | "graphNode" | "textNode" | "stackNode" | "queueNode" | "mapNode"
- position: { x: number, y: number } (always include {x:0, y:0})
- data: object (Schema depends on type! Pay attention to the wrapper keys!)
  - If arrayNode: { values: [1, 2, 3] }
  - If matrixNode: { grid: [[1, 2, 3], [4, 5, 6]] } 
    CRITICAL: For matrices, every single cell MUST be its own array element. If the problem matrix is [[3, 0, 1], [5, 6, 3]], you MUST output exactly that. NEVER combine numbers into single integers (e.g. do NOT output [301]) or strings!
  - If graphNode: { nodes: ["A", "B"], edges: [{source: "A", target: "B"}] }
  - If textNode: { text: string }
  - If stackNode: { values: [number, ...] }
  - If queueNode: { values: [number, ...] }
  - If mapNode: { entries: [{key: string, value: string}, ...] }

"edges" array items:
- id: string
- source: string (node id)
- target: string (node id)
- label: string | null
`;

  let messages = [
    {
      role: "system",
      content: `You are an expert AI that creates interactive dry-run boards for algorithmic problems. 
Your goal is to build a visual representation that helps a developer dry-run the given code or problem.

Visualization Guidelines:
1. Choose the right data structures: 
   - 2D grid/matrix problems -> Use a "matrixNode".
   - 1D array problems -> Use "arrayNode".
   - Graphs/Trees -> Use "graphNode" connected by edges.
   - Hash maps/dictionaries -> Use "mapNode".
   - Stacks/Queues -> Use "stackNode" or "queueNode".
2. Include context: Use "textNode" to write down the problem statement, constraints, or specific queries (e.g., "Query: sumRegion(2, 1, 4, 3)").
3. Connect related concepts using edges (e.g., link a query text node to the matrix).
4. Do NOT generate random unrelated nodes. If it's a matrix problem, just show the matrix and maybe some text/arrays for queries.

You output strictly valid JSON conforming to this Schema:
${schemaInstructions}`
    },
    {
      role: "user",
      content: `Analyze the following code and generate a visual representation using the provided canvas schema.\n\nCode:\n${codeSnippet}`
    }
  ];

  let retries = 0;
  let lastError = "";
  const maxRetries = 3;

  while (retries < maxRetries) {
    const requestBody = {
      model: "llama-3.3-70b-versatile",
      messages: messages,
      response_format: {
        type: "json_object"
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Groq API error: ${response.status} ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let parsedJson;
    try {
      parsedJson = JSON.parse(content);
      // Pre-process missing positions before Zod trips on them
      if (parsedJson.nodes && Array.isArray(parsedJson.nodes)) {
        parsedJson.nodes.forEach(node => {
          if (node && !node.position) {
            node.position = { x: 0, y: 0 };
          }
        });
      }
    } catch (parseError) {
      lastError = parseError.message;
      messages.push({ role: "assistant", content: content });
      messages.push({
        role: "user",
        content: `Failed to parse JSON response: ${parseError.message}. Please output strictly valid JSON.`
      });
      retries++;
      continue;
    }

    try {
      const validData = CanvasStateSchema.parse(parsedJson);
      
      validData.nodes.forEach((node, index) => {
        if (node.position.x === 0 && node.position.y === 0) {
          node.position = { 
            x: 100 + (index % 3) * 300, 
            y: 100 + Math.floor(index / 3) * 200 
          };
        }
      });

      return validData;
    } catch (zodError) {
      lastError = zodError.message;
      messages.push({ role: "assistant", content: content });
      messages.push({
        role: "user",
        content: `Validation failed against the schema with the following error:\n${zodError.message}\n\nPlease fix the specific validation failure and output the corrected JSON.`
      });
      retries++;
    }
  }

  throw new Error(`Max retries exceeded. Last error: ${lastError}`);
}
