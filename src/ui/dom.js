// Small helper for safe DOM creation
export function el(tag, className, children = []) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (!Array.isArray(children)) children = [children];
  children.forEach(child => {
    if (child == null) return;
    if (typeof child === 'string' || typeof child === 'number') {
      const t = document.createTextNode(String(child));
      node.appendChild(t);
    } else if (child instanceof Node) {
      node.appendChild(child);
    }
  });
  return node;
}

export function clear(elNode) {
  while (elNode.firstChild) elNode.removeChild(elNode.firstChild);
}
