import { filter, forEach } from 'lodash';

const INVISIBLE_NODES = ['programs', 'projects'];

export const treeNodeVisible = (name) => INVISIBLE_NODES.indexOf(name) === -1;

export const formatTreeData = (treeData) => {
  forEach(treeData, node => {
    if (!treeNodeVisible(node.name)) {
      forEach(treeData, parent => {
        if (parent.subresources.indexOf(node.path) !== -1) {
          let subresources = [...parent.subresources, ...node.subresources];
          subresources = filter(subresources, res => res !== node.path);
          // eslint-disable-next-line no-param-reassign
          parent.subresources = subresources;
        }
      });
    }
  });
  return filter(treeData, res => treeNodeVisible(res.name));
};

// Unflatten an array to tree
export const unflatten = (resources) => {
  const tree = [];
  const mappedArr = {};

  for (let i = 0, len = resources.length; i < len; i += 1) {
    const arrElem = resources[i];
    mappedArr[arrElem.path] = arrElem;
    mappedArr[arrElem.path].children = [];
    mappedArr[arrElem.path].parentPath = null;
  }

  Object.keys(mappedArr).forEach(path => {
    const mappedElem = mappedArr[path];
    if (mappedElem.subresources.length) {
      forEach(mappedElem.subresources, res => {
        if (mappedArr[res]) {
          mappedArr[res].parentPath = path;
        }
      });
    }
  });
  Object.keys(mappedArr).forEach(path => {
    const mappedElem = mappedArr[path];
    if (mappedElem.parentPath) {
      mappedArr[mappedElem.parentPath].children.push(mappedElem);
    } else {
      tree.push(mappedElem);
    }
  });
  return tree;
};
