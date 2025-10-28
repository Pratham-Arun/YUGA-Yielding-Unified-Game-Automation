/**
 * Base Node class inspired by Godot's Node system
 * Represents a scene tree node with transform, properties, and lifecycle
 */
export class Node {
  constructor(name = 'Node', nodeType = 'Node') {
    this.id = Math.random().toString(36).substr(2, 9);
    this.name = name;
    this.nodeType = nodeType;
    this.parent = null;
    this.children = [];
    this.transform = {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    };
    this.properties = {};
    this.enabled = true;
    this.visible = true;
    this.components = new Map();
  }

  addChild(node) {
    if (node.parent) node.parent.removeChild(node);
    node.parent = this;
    this.children.push(node);
    return node;
  }

  removeChild(node) {
    const idx = this.children.indexOf(node);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      node.parent = null;
    }
  }

  getChild(index) {
    return this.children[index];
  }

  getChildCount() {
    return this.children.length;
  }

  addComponent(name, component) {
    this.components.set(name, component);
    component.node = this;
    if (component.onAttach) component.onAttach();
    return component;
  }

  getComponent(name) {
    return this.components.get(name);
  }

  removeComponent(name) {
    const comp = this.components.get(name);
    if (comp && comp.onDetach) comp.onDetach();
    this.components.delete(name);
  }

  setProperty(key, value) {
    this.properties[key] = value;
  }

  getProperty(key) {
    return this.properties[key];
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      nodeType: this.nodeType,
      transform: this.transform,
      properties: this.properties,
      enabled: this.enabled,
      visible: this.visible,
      children: this.children.map(c => c.toJSON())
    };
  }

  static fromJSON(data) {
    const node = new Node(data.name, data.nodeType);
    node.id = data.id;
    node.transform = data.transform;
    node.properties = data.properties;
    node.enabled = data.enabled;
    node.visible = data.visible;
    if (data.children) {
      data.children.forEach(childData => {
        node.addChild(Node.fromJSON(childData));
      });
    }
    return node;
  }
}

/**
 * Node2D - 2D scene node
 */
export class Node2D extends Node {
  constructor(name = 'Node2D') {
    super(name, 'Node2D');
  }
}

/**
 * Node3D - 3D scene node
 */
export class Node3D extends Node {
  constructor(name = 'Node3D') {
    super(name, 'Node3D');
  }
}

/**
 * Mesh node for 3D rendering
 */
export class MeshNode extends Node3D {
  constructor(name = 'Mesh') {
    super(name);
    this.nodeType = 'MeshNode';
    this.meshType = 'cube';
    this.material = { color: 0x6366f1 };
  }
}

/**
 * Camera node
 */
export class CameraNode extends Node3D {
  constructor(name = 'Camera') {
    super(name);
    this.nodeType = 'CameraNode';
    this.fov = 60;
    this.near = 0.1;
    this.far = 1000;
  }
}

/**
 * Light node
 */
export class LightNode extends Node3D {
  constructor(name = 'Light') {
    super(name);
    this.nodeType = 'LightNode';
    this.lightType = 'directional';
    this.intensity = 1;
    this.color = 0xffffff;
  }
}
