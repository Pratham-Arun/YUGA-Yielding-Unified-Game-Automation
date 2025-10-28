import { Node3D, MeshNode, CameraNode, LightNode } from './Node.js';

/**
 * Scene manager inspired by Godot's SceneTree
 * Manages the hierarchy of nodes and scene lifecycle
 */
export class Scene {
  constructor(name = 'Scene') {
    this.name = name;
    this.root = new Node3D('Root');
    this.nodes = new Map();
    this.selectedNode = null;
    this.listeners = new Set();
  }

  /**
   * Create a new node and add to scene
   */
  createNode(nodeType, name) {
    let node;
    switch (nodeType) {
      case 'MeshNode':
        node = new MeshNode(name);
        break;
      case 'CameraNode':
        node = new CameraNode(name);
        break;
      case 'LightNode':
        node = new LightNode(name);
        break;
      case 'Node3D':
      default:
        node = new Node3D(name);
    }
    this.addNode(node);
    return node;
  }

  /**
   * Add node to scene
   */
  addNode(node, parent = null) {
    this.nodes.set(node.id, node);
    if (parent) {
      parent.addChild(node);
    } else {
      this.root.addChild(node);
    }
    this.notifyListeners('nodeAdded', node);
    return node;
  }

  /**
   * Remove node from scene
   */
  removeNode(nodeId) {
    const node = this.nodes.get(nodeId);
    if (node && node.parent) {
      node.parent.removeChild(node);
      this.nodes.delete(nodeId);
      this.notifyListeners('nodeRemoved', node);
    }
  }

  /**
   * Get node by ID
   */
  getNode(nodeId) {
    return this.nodes.get(nodeId);
  }

  /**
   * Select a node
   */
  selectNode(nodeId) {
    this.selectedNode = this.nodes.get(nodeId);
    this.notifyListeners('nodeSelected', this.selectedNode);
  }

  /**
   * Get all nodes as flat array
   */
  getAllNodes() {
    return Array.from(this.nodes.values());
  }

  /**
   * Get scene tree as hierarchy
   */
  getHierarchy() {
    return this._buildHierarchy(this.root);
  }

  _buildHierarchy(node) {
    return {
      id: node.id,
      name: node.name,
      nodeType: node.nodeType,
      children: node.children.map(child => this._buildHierarchy(child))
    };
  }

  /**
   * Subscribe to scene changes
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   */
  notifyListeners(event, data) {
    this.listeners.forEach(cb => cb({ event, data }));
  }

  /**
   * Serialize scene to JSON
   */
  toJSON() {
    return {
      name: this.name,
      root: this.root.toJSON()
    };
  }

  /**
   * Load scene from JSON
   */
  static fromJSON(data) {
    const scene = new Scene(data.name);
    scene.root = Node3D.fromJSON(data.root);
    // Rebuild nodes map
    const traverse = (node) => {
      scene.nodes.set(node.id, node);
      node.children.forEach(traverse);
    };
    traverse(scene.root);
    return scene;
  }
}
