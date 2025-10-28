// Node definitions and types
export const NODE_TYPES = {
  EVENT: {
    START: { type: 'event', title: 'On Start', outputs: ['trigger'] },
    UPDATE: { type: 'event', title: 'On Update', outputs: ['trigger'] },
    COLLISION: { type: 'event', title: 'On Collision', outputs: ['trigger', 'other'] }
  },
  FUNCTION: {
    PRINT: { type: 'function', title: 'Print', inputs: ['message'], outputs: ['next'] },
    GET_COMPONENT: { type: 'function', title: 'Get Component', inputs: ['type'], outputs: ['component'] },
    TRANSFORM: { type: 'function', title: 'Transform', inputs: ['position', 'rotation', 'scale'], outputs: ['next'] }
  },
  MATH: {
    ADD: { type: 'math', operation: 'add', title: 'Add', inputs: ['a', 'b'], outputs: ['result'] },
    SUBTRACT: { type: 'math', operation: 'subtract', title: 'Subtract', inputs: ['a', 'b'], outputs: ['result'] },
    MULTIPLY: { type: 'math', operation: 'multiply', title: 'Multiply', inputs: ['a', 'b'], outputs: ['result'] },
    DIVIDE: { type: 'math', operation: 'divide', title: 'Divide', inputs: ['a', 'b'], outputs: ['result'] }
  },
  LOGIC: {
    AND: { type: 'logic', operation: 'and', title: 'AND', inputs: ['a', 'b'], outputs: ['result'] },
    OR: { type: 'logic', operation: 'or', title: 'OR', inputs: ['a', 'b'], outputs: ['result'] },
    NOT: { type: 'logic', operation: 'not', title: 'NOT', inputs: ['a'], outputs: ['result'] },
    EQUALS: { type: 'logic', operation: 'equals', title: 'Equals', inputs: ['a', 'b'], outputs: ['result'] }
  }
};