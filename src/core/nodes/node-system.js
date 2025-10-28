// Node types and execution system
import { ScriptWorker } from '../script-worker.js';

export class NodeSystem {
  constructor() {
    this.nodes = new Map();
    this.connections = new Map();
    this.worker = new ScriptWorker();
    this.isExecuting = false;
  }

  addNode(node) {
    this.nodes.set(node.id, node);
  }

  removeNode(id) {
    this.nodes.delete(id);
    // Clean up connections
    this.connections.forEach((conn, key) => {
      if (conn.from.nodeId === id || conn.to.nodeId === id) {
        this.connections.delete(key);
      }
    });
  }

  connect(fromNodeId, fromPort, toNodeId, toPort) {
    const connId = `${fromNodeId}:${fromPort}-${toNodeId}:${toPort}`;
    this.connections.set(connId, {
      from: { nodeId: fromNodeId, port: fromPort },
      to: { nodeId: toNodeId, port: toPort }
    });
  }

  disconnect(connId) {
    this.connections.delete(connId);
  }

  async execute(startNodeId) {
    if (this.isExecuting) return;
    this.isExecuting = true;

    try {
      const visited = new Set();
      await this._executeNode(startNodeId, visited);
    } finally {
      this.isExecuting = false;
    }
  }

  async _executeNode(nodeId, visited) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = this.nodes.get(nodeId);
    if (!node) return;

    // Execute node logic
    const result = await this._evaluateNode(node);
    node.output = result;

    // Find and execute connected nodes
    this.connections.forEach(conn => {
      if (conn.from.nodeId === nodeId) {
        this._executeNode(conn.to.nodeId, visited);
      }
    });
  }

  async _evaluateNode(node) {
    switch (node.type) {
      case 'event':
        return true;
      case 'function':
        return await this.worker.execute(node.code, node.inputs);
      case 'math':
        return this._evaluateMath(node);
      case 'logic':
        return this._evaluateLogic(node);
      default:
        return null;
    }
  }

  _evaluateMath(node) {
    const a = parseFloat(node.inputs.a) || 0;
    const b = parseFloat(node.inputs.b) || 0;
    switch (node.operation) {
      case 'add': return a + b;
      case 'subtract': return a - b;
      case 'multiply': return a * b;
      case 'divide': return b !== 0 ? a / b : 0;
      default: return 0;
    }
  }

  _evaluateLogic(node) {
    const a = node.inputs.a;
    const b = node.inputs.b;
    switch (node.operation) {
      case 'and': return a && b;
      case 'or': return a || b;
      case 'not': return !a;
      case 'equals': return a === b;
      case 'notEquals': return a !== b;
      default: return false;
    }
  }

  getNodeState(nodeId) {
    return this.nodes.get(nodeId)?.output;
  }

  clearState() {
    this.nodes.forEach(node => {
      node.output = null;
    });
  }
}