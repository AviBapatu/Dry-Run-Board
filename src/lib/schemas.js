import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const ArrayNodeDataSchema = z.object({
  values: z.array(z.number())
});

export const MatrixNodeDataSchema = z.object({
  rows: z.number(),
  cols: z.number(),
  values: z.array(z.array(z.number()))
});

export const GraphNodeDataSchema = z.object({
  nodes: z.array(z.string()),
  edges: z.array(
    z.object({
      source: z.string(),
      target: z.string()
    })
  )
});

export const TextNodeDataSchema = z.object({
  text: z.string()
});

export const NodeSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string(),
    type: z.literal('ArrayNode'),
    position: z.object({ x: z.number(), y: z.number() }),
    data: ArrayNodeDataSchema
  }),
  z.object({
    id: z.string(),
    type: z.literal('MatrixNode'),
    position: z.object({ x: z.number(), y: z.number() }),
    data: MatrixNodeDataSchema
  }),
  z.object({
    id: z.string(),
    type: z.literal('GraphNode'),
    position: z.object({ x: z.number(), y: z.number() }),
    data: GraphNodeDataSchema
  }),
  z.object({
    id: z.string(),
    type: z.literal('TextNode'),
    position: z.object({ x: z.number(), y: z.number() }),
    data: TextNodeDataSchema
  })
]);

export const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  // Use nullable instead of optional since strict mode wants all keys in required array
  label: z.string().nullable()
});

export const CanvasStateSchema = z.object({
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema)
});

/**
 * Recursively enforces strict mode on a JSON schema object by setting
 * additionalProperties to false on objects and arrays, and ensuring
 * all properties are required.
 */
function enforceStrictMode(schema) {
  if (!schema || typeof schema !== 'object') return schema;

  if (schema.type === 'object') {
    schema.additionalProperties = false;
    
    if (schema.properties) {
      const keys = Object.keys(schema.properties);
      schema.required = keys;
      
      for (const key of keys) {
        enforceStrictMode(schema.properties[key]);
      }
    } else {
      schema.properties = {};
      schema.required = [];
    }
  } else if (schema.type === 'array') {
    schema.additionalProperties = false;
    if (schema.items) {
      enforceStrictMode(schema.items);
    }
  } else if (schema.anyOf) {
    schema.anyOf.forEach(enforceStrictMode);
  } else if (schema.oneOf) {
    schema.oneOf.forEach(enforceStrictMode);
  } else if (schema.allOf) {
    schema.allOf.forEach(enforceStrictMode);
  }

  return schema;
}

/**
 * Translates the CanvasState Zod schema into a raw JSON Schema object
 * formatted for Groq API strict mode structured outputs.
 */
export function getGroqJSONSchema() {
  const rawSchema = zodToJsonSchema(CanvasStateSchema, {
    name: 'CanvasState',
    $refStrategy: 'none' // Disable refs to simplify strict mode manipulation
  });
  
  // zodToJsonSchema wraps it in definitions if a name is provided
  const rootSchema = rawSchema.definitions 
    ? rawSchema.definitions.CanvasState 
    : rawSchema;
    
  return enforceStrictMode(rootSchema);
}
