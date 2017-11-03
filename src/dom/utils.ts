// Sorts nodes by order of occurrence in the document.
export function sortNodes(nodes: Node[]): Node[] {
  return nodes.sort((item0, item1) => {
    const path0 = getNodePath(item0);
    const path1 = getNodePath(item1);
    const count0 = path0.length;
    const count1 = path1.length;
    const len = Math.min(count0, count1);

    for (let i = 0; i < len; i++) {
      if (path0[i] !== path1[i]) {
        return path0[i] - path1[i];
      }
    }

    return count0 - count1;
  });
}

function getNodePath(node: Node): number[] {
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
