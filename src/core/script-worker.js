// Script execution sandbox
self.onmessage = function(e) {
  const { id, code, type, node, deltaTime } = e.data;
  
  // Allowed APIs and helpers
  const apis = {
    transform: {
      setPosition: (x, y, z) => {
        self.postMessage({ type: 'transform', action: 'setPosition', args: [x, y, z], id });
      },
      translate: (x, y, z) => {
        self.postMessage({ type: 'transform', action: 'translate', args: [x, y, z], id });
      },
      rotate: (x, y, z) => {
        self.postMessage({ type: 'transform', action: 'rotate', args: [x, y, z], id });
      },
      scale: (x, y, z) => {
        self.postMessage({ type: 'transform', action: 'scale', args: [x, y, z], id });
      }
    },
    log: (...args) => {
      self.postMessage({ type: 'log', args, id });
    },
    // Add more safe APIs here
  };

  try {
    if (type === 'dsl') {
      // DSL command interpreter
      const commands = JSON.parse(code);
      if (Array.isArray(commands)) {
        for (const cmd of commands) {
          if (cmd && typeof cmd.cmd === 'string') {
            switch (cmd.cmd) {
              case 'setPosition':
              case 'translate':
              case 'rotate':
              case 'scale':
                if (Array.isArray(cmd.args) && cmd.args.length >= 3) {
                  apis.transform[cmd.cmd](...cmd.args);
                }
                break;
              case 'log':
                apis.log(cmd.msg || cmd.args || '');
                break;
            }
          }
        }
      }
    } else if (type === 'js') {
      // Sandboxed JS execution
      const fn = new Function('api', 'node', 'deltaTime', `
        with (api) {
          ${code}
        }
      `);
      fn(apis, node, deltaTime);
    }
    
    self.postMessage({ type: 'success', id });
  } catch (err) {
    self.postMessage({ type: 'error', error: err.message, id });
  }
};