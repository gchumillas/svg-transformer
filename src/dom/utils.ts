export function getNodePath(node: Node): number[] {
  const ret = [];
  let parentNode = node.parentNode;

  while (parentNode !== null && !document.isSameNode(parentNode)) {
    const childs = parentNode.childNodes;
    const length = childs.length;
    let pos = 0;

    // gets the sibling position
    for (let i = 0; i < length; i++) {
      const childElement = childs[i];

      if (childElement.isSameNode(node)) {
        pos = i;
        break;
      }
    }

    ret.unshift(pos);
    node = parentNode;
    parentNode = node.parentNode;
  }

  return ret;
}
