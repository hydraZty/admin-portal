// Unflatten an array to tree
export const unflatten = (arr) => {
  const tree = [];
  const mappedArr = {};

  for (let i = 0, len = arr.length; i < len; i++) {
    const arrElem = arr[i];
    mappedArr[arrElem.path] = arrElem;
    mappedArr[arrElem.path].children = [];
    mappedArr[arrElem.path].parentPath = null;
  }

  for (const path in mappedArr) {
    if ({}.hasOwnProperty.call(mappedArr, path)) {
      const mappedElem = mappedArr[path];
      if (mappedElem.subresources.length) {
        for (const res of mappedElem.subresources) {
          if (mappedArr[res]) {
            mappedArr[res].parentPath = path;
          }
        }
      }
    }
  }


  for (const path in mappedArr) {
    if ({}.hasOwnProperty.call(mappedArr, path)) {
      const mappedElem = mappedArr[path];
      if (mappedElem.parentPath) {
        mappedArr[mappedElem.parentPath].children.push(mappedElem);
      } else {
        tree.push(mappedElem);
      }
    }
  }
  return tree;
};
