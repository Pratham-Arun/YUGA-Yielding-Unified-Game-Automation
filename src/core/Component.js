/**
 * Base Component class inspired by Godot's script system
 * Components can be attached to nodes to add behavior
 */
export class Component {
  constructor(name = 'Component') {
    this.name = name;
    this.node = null;
    this.enabled = true;
  }

  /**
   * Called when component is attached to a node
   */
  onAttach() {}

  /**
   * Called when component is detached from a node
   */
  onDetach() {}

  /**
   * Called every frame
   */
  update(deltaTime) {}

  /**
   * Called for physics updates
   */
  fixedUpdate(deltaTime) {}

  /**
   * Called when node becomes visible
   */
  onEnable() {}

  /**
   * Called when node becomes invisible
   */
  onDisable() {}
}

/**
 * Transform component for position, rotation, scale
 */
export class TransformComponent extends Component {
  constructor() {
    super('Transform');
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];
  }

  setPosition(x, y, z) {
    this.position = [x, y, z];
    if (this.node) this.node.transform.position = this.position;
  }

  setRotation(x, y, z) {
    this.rotation = [x, y, z];
    if (this.node) this.node.transform.rotation = this.rotation;
  }

  setScale(x, y, z) {
    this.scale = [x, y, z];
    if (this.node) this.node.transform.scale = this.scale;
  }
}

/**
 * Renderer component for 3D rendering
 */
export class RendererComponent extends Component {
  constructor(meshType = 'cube', color = 0x6366f1) {
    super('Renderer');
    this.meshType = meshType;
    this.color = color;
    this.material = {
      color: color,
      metalness: 0.3,
      roughness: 0.4
    };
    this.mesh = null;
  }

  setColor(color) {
    this.color = color;
    this.material.color = color;
    if (this.mesh && this.mesh.material) {
      this.mesh.material.color.setHex(color);
    }
  }
}

/**
 * Script component for custom behavior
 */
export class ScriptComponent extends Component {
  constructor(scriptCode = '') {
    super('Script');
    this.scriptCode = scriptCode;
    this.worker = null;
    this.trusted = false;
    this.pendingExecutions = new Map();
    this.executionId = 0;
  }

  initWorker() {
    if (this.worker) return;
    this.worker = new Worker(new URL('./script-worker.js', import.meta.url));
    this.worker.onmessage = (e) => {
      const { type, id, action, args, error } = e.data;
      const resolve = this.pendingExecutions.get(id);
      if (resolve) {
        this.pendingExecutions.delete(id);
        if (type === 'error') {
          console.error('Script execution error:', error);
          resolve(false);
        } else if (type === 'transform' && this.node) {
          // Apply transform updates from worker
          switch (action) {
            case 'setPosition':
              this.node.transform.position = args.map(Number);
              break;
            case 'translate':
              this.node.transform.position = this.node.transform.position.map((v, i) => v + (Number(args[i]) || 0));
              break;
            case 'rotate':
              this.node.transform.rotation = this.node.transform.rotation.map((v, i) => v + (Number(args[i]) || 0));
              break;
            case 'scale':
              this.node.transform.scale = args.map(v => Number(v) || 1);
              break;
          }
          resolve(true);
        } else if (type === 'log') {
          console.log('[ScriptComponent]', ...args);
          resolve(true);
        } else if (type === 'success') {
          resolve(true);
        }
      }
    };
    this.worker.onerror = (err) => {
      console.error('Script worker error:', err);
    };
  }

  /**
   * Set script. Default to DSL mode for safety.
   * If trusted:true is passed, allows raw JS execution in worker.
   */
  setScript(code, opts = { trusted: false }) {
    this.scriptCode = code;
    this.trusted = Boolean(opts.trusted);
    
    // Clean up any existing worker
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }

  async execute(node, deltaTime) {
    if (!this.scriptCode) return;
    
    try {
      this.initWorker();
      const id = ++this.executionId;
      
      // Determine execution type
      let type = 'dsl';
      if (this.trusted) {
        type = 'js';
      } else if (!this.scriptCode.trim().startsWith('[')) {
        console.warn('Untrusted scripts must use DSL format (JSON array of commands)');
        return;
      }

      // Execute in worker and wait for result
      const promise = new Promise(resolve => {
        this.pendingExecutions.set(id, resolve);
      });

      this.worker.postMessage({
        id,
        type,
        code: this.scriptCode,
        node: {
          transform: {
            position: [...node.transform.position],
            rotation: [...node.transform.rotation],
            scale: [...node.transform.scale]
          }
        },
        deltaTime
      });

      const success = await promise;
      if (!success) {
        console.warn('Script execution failed');
      }
    } catch (err) {
      console.error('Script execution error:', err);
    }
  }

  update(deltaTime) {
    if (this.scriptCode && this.node) {
      this.execute(this.node, deltaTime).catch(err => {
        console.error('Script execution error:', err);
      });
    }
  }
}

/**
 * Physics component for rigid body physics
 */
export class PhysicsComponent extends Component {
  constructor() {
    super('Physics');
    this.mass = 1;
    this.velocity = [0, 0, 0];
    this.acceleration = [0, 0, 0];
    this.useGravity = true;
    this.isKinematic = false;
  }

  applyForce(fx, fy, fz) {
    this.acceleration[0] += fx / this.mass;
    this.acceleration[1] += fy / this.mass;
    this.acceleration[2] += fz / this.mass;
  }

  update(deltaTime) {
    if (this.useGravity) {
      this.acceleration[1] -= 9.81;
    }

    // Update velocity
    this.velocity[0] += this.acceleration[0] * deltaTime;
    this.velocity[1] += this.acceleration[1] * deltaTime;
    this.velocity[2] += this.acceleration[2] * deltaTime;

    // Update position
    if (this.node) {
      const pos = this.node.transform.position;
      pos[0] += this.velocity[0] * deltaTime;
      pos[1] += this.velocity[1] * deltaTime;
      pos[2] += this.velocity[2] * deltaTime;
    }

    // Reset acceleration
    this.acceleration = [0, 0, 0];
  }
}

/**
 * Animator component for animations
 */
export class AnimatorComponent extends Component {
  constructor() {
    super('Animator');
    this.animations = new Map();
    this.currentAnimation = null;
    this.currentTime = 0;
  }

  addAnimation(name, keyframes) {
    this.animations.set(name, keyframes);
  }

  play(name) {
    if (this.animations.has(name)) {
      this.currentAnimation = name;
      this.currentTime = 0;
    }
  }

  update(deltaTime) {
    if (!this.currentAnimation) return;

    const keyframes = this.animations.get(this.currentAnimation);
    if (!keyframes) return;

    this.currentTime += deltaTime;
    const duration = keyframes[keyframes.length - 1].time;

    if (this.currentTime > duration) {
      this.currentAnimation = null;
      return;
    }

    // Interpolate between keyframes
    for (let i = 0; i < keyframes.length - 1; i++) {
      const kf1 = keyframes[i];
      const kf2 = keyframes[i + 1];

      if (this.currentTime >= kf1.time && this.currentTime <= kf2.time) {
        const t = (this.currentTime - kf1.time) / (kf2.time - kf1.time);
        // Apply interpolation to node
        if (this.node && kf1.position && kf2.position) {
          this.node.transform.position = [
            kf1.position[0] + (kf2.position[0] - kf1.position[0]) * t,
            kf1.position[1] + (kf2.position[1] - kf1.position[1]) * t,
            kf1.position[2] + (kf2.position[2] - kf1.position[2]) * t
          ];
        }
      }
    }
  }
}
