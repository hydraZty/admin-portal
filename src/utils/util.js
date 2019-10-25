import {
  filter, find, forEach, toUpper,
} from 'lodash';

const INVISIBLE_NODES = ['programs', 'projects'];

export const treeNodeVisible = (name) => INVISIBLE_NODES.indexOf(name) === -1;

export const formatResourceName = (resource) => {
  let res = resource;
  res = res.replace('_', '-');
  return toUpper(res);
};

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

export const formatPolicies = (policiesFormData) => {
  const policies = [];
  policiesFormData.forEach(item => {
    if (item.resources.length) {
      item.resources.forEach(resource => {
        policies.push({
          policy: resource.policy,
          resource: resource.resource,
          role: item.role,
        });
      });
    } else {
      policies.push({
        policy: item.role,
        resource: '',
        role: item.role,
      });
    }
  });
  return policies;
};

export const formatNamespaceTree = (respResources) => {
  const resources = formatTreeData(respResources);
  const unFlattenResources = unflatten(resources);
  const resourceOptions = [];
  unFlattenResources.forEach(res => {
    if (!res.namespace) {
      let currentDefaultNamespace = find(resourceOptions, option => option.name === 'default');
      if (!currentDefaultNamespace) {
        currentDefaultNamespace = {
          name: 'default',
          path: '',
          tag: '',
          description: '',
          namespace: true,
          children: [res],
        };
        resourceOptions.push(currentDefaultNamespace);
      } else {
        currentDefaultNamespace.children.push(res);
      }
    } else {
      resourceOptions.push(res);
    }
  });
  return resourceOptions;
};
