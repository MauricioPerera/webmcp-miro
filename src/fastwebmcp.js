/**
 * FastWebMCP - WebMCP Client Runtime & Ergonomic Tool Builder
 * Inspired by FastMCP and compliant with the WebMCP emerging standard (Chrome 149+ origin trial, webmcp.com).
 * Repository reference: https://github.com/MauricioPerera/fastwebmcp
 */

const NAME_PATTERN = /^[A-Za-z0-9_.-]{1,128}$/;
const NAME_BUDGET = 30;
const DESCRIPTION_BUDGET = 500;

// In-memory registry of all tools registered via FastWebMCP (accessible to agents and local inspectors)
if (!globalThis.__WEBMCP_REGISTRY__) {
  globalThis.__WEBMCP_REGISTRY__ = new Map();
}

/**
 * Checks whether the browser natively supports WebMCP (document.modelContext).
 * @returns {boolean}
 */
export function supportsWebMcp() {
  if (typeof globalThis.document !== 'object' || globalThis.document === null) {
    return false;
  }
  const modelContext = globalThis.document.modelContext;
  return typeof modelContext === 'object' && modelContext !== null && typeof modelContext.registerTool === 'function';
}

/**
 * Validates a value against a basic JSON Schema (type, required, properties, enum, minimum, maximum).
 * Self-contained validator so FastWebMCP has zero external runtime dependencies.
 * @param {Record<string, any>} schema
 * @param {any} data
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateSchema(schema, data) {
  const errors = [];
  if (!schema || typeof schema !== 'object') {
    return { valid: true, errors: [] };
  }

  if (schema.type === 'object') {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      errors.push(`Expected object, received ${data === null ? 'null' : Array.isArray(data) ? 'array' : typeof data}`);
      return { valid: false, errors };
    }

    if (Array.isArray(schema.required)) {
      for (const reqKey of schema.required) {
        if (!(reqKey in data) || data[reqKey] === undefined) {
          errors.push(`Missing required property "${reqKey}"`);
        }
      }
    }

    if (schema.properties && typeof schema.properties === 'object') {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        if (key in data && data[key] !== undefined) {
          const subResult = validateSchema(propSchema, data[key]);
          if (!subResult.valid) {
            errors.push(...subResult.errors.map(err => `.${key}: ${err}`));
          }
        }
      }
    }
  } else if (schema.type === 'string') {
    if (typeof data !== 'string') {
      errors.push(`Expected string, received ${typeof data}`);
    } else {
      if (Array.isArray(schema.enum) && !schema.enum.includes(data)) {
        errors.push(`Value "${data}" not in enum [${schema.enum.join(', ')}]`);
      }
    }
  } else if (schema.type === 'number' || schema.type === 'integer') {
    if (typeof data !== 'number' || Number.isNaN(data) || !Number.isFinite(data)) {
      errors.push(`Expected valid finite number, received ${data}`);
    } else {
      if (schema.type === 'integer' && !Number.isInteger(data)) {
        errors.push(`Expected integer, received float`);
      }
      if (typeof schema.minimum === 'number' && data < schema.minimum) {
        errors.push(`Value ${data} < minimum ${schema.minimum}`);
      }
      if (typeof schema.maximum === 'number' && data > schema.maximum) {
        errors.push(`Value ${data} > maximum ${schema.maximum}`);
      }
    }
  } else if (schema.type === 'boolean') {
    if (typeof data !== 'boolean') {
      errors.push(`Expected boolean, received ${typeof data}`);
    }
  } else if (schema.type === 'array') {
    if (!Array.isArray(data)) {
      errors.push(`Expected array, received ${typeof data}`);
    } else if (schema.items && typeof schema.items === 'object') {
      data.forEach((item, idx) => {
        const itemResult = validateSchema(schema.items, item);
        if (!itemResult.valid) {
          errors.push(...itemResult.errors.map(err => `[${idx}]: ${err}`));
        }
      });
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Defines and normalizes a WebMCP tool specification.
 * @param {Object} spec
 * @param {string} spec.name
 * @param {string} spec.description
 * @param {Record<string, any>} [spec.inputSchema]
 * @param {Function} spec.execute
 * @param {Object} [spec.annotations]
 * @param {string} [spec.title]
 * @returns {Object} DefinedTool
 */
export function defineTool(spec) {
  if (!spec || typeof spec !== 'object') {
    throw new Error('defineTool: spec must be an object');
  }
  if (typeof spec.name !== 'string' || spec.name.trim() === '') {
    throw new Error('defineTool: name must be a non-empty string');
  }
  if (!NAME_PATTERN.test(spec.name)) {
    throw new Error('defineTool: name must be 1-128 characters of letters, numbers, "_", "-", or "."');
  }
  if (typeof spec.description !== 'string' || spec.description.trim() === '') {
    throw new Error('defineTool: description must be a non-empty string');
  }
  if (typeof spec.execute !== 'function') {
    throw new Error('defineTool: execute must be a function');
  }

  if (spec.name.length > NAME_BUDGET) {
    console.warn(`fastwebmcp: tool name "${spec.name}" is ${spec.name.length} chars; recommended <=${NAME_BUDGET}`);
  }
  if (spec.description.length > DESCRIPTION_BUDGET) {
    console.warn(`fastwebmcp: tool description is ${spec.description.length} chars; recommended <=${DESCRIPTION_BUDGET}`);
  }

  const rawSchema = spec.inputSchema && typeof spec.inputSchema.toJSONSchema === 'function'
    ? spec.inputSchema.toJSONSchema()
    : spec.inputSchema || { type: 'object', properties: {} };

  return {
    name: spec.name,
    title: spec.title || spec.name,
    description: spec.description,
    inputSchema: rawSchema,
    annotations: spec.annotations || {},
    execute: async (rawInput = {}, context = {}) => {
      const signal = context.signal || new AbortController().signal;
      const val = validateSchema(rawSchema, rawInput);
      if (!val.valid) {
        throw new Error(`fastwebmcp: input validation failed for "${spec.name}": ${val.errors.join('; ')}`);
      }
      return await spec.execute(rawInput, { signal });
    }
  };
}

/**
 * Registers a tool on the browser native WebMCP model context and the local registry.
 * @param {Object} spec
 * @param {Object} [options]
 * @returns {boolean} Whether native registration succeeded
 */
export function registerTool(spec, options = {}) {
  const tool = defineTool(spec);
  globalThis.__WEBMCP_REGISTRY__.set(tool.name, tool);

  const nativeSupported = supportsWebMcp();
  if (nativeSupported) {
    try {
      globalThis.document.modelContext.registerTool(tool, options);
    } catch (err) {
      console.warn('fastwebmcp: native registerTool failed:', err);
    }
  }

  // Dispatch custom event for UI reaction (e.g. WebMCP live badge or console inspector)
  if (typeof globalThis.dispatchEvent === 'function') {
    try {
      globalThis.dispatchEvent(new CustomEvent('webmcp:tool-registered', { detail: { tool, nativeSupported } }));
    } catch (_) {}
  }

  return nativeSupported;
}

/**
 * Returns an array of all registered tools.
 * @returns {Array<Object>}
 */
export function getRegisteredTools() {
  return Array.from(globalThis.__WEBMCP_REGISTRY__.values());
}

/**
 * Invokes a registered tool by name with input arguments.
 * @param {string} name
 * @param {any} input
 * @param {Object} [context]
 * @returns {Promise<any>}
 */
export async function invokeTool(name, input = {}, context = {}) {
  const tool = globalThis.__WEBMCP_REGISTRY__.get(name);
  if (!tool) {
    throw new Error(`fastwebmcp: tool "${name}" not found in registry`);
  }
  return await tool.execute(input, context);
}

// Global browser attachment
if (typeof window !== 'undefined') {
  window.FastWebMCP = {
    supportsWebMcp,
    defineTool,
    registerTool,
    getRegisteredTools,
    invokeTool,
    validateSchema
  };
}
