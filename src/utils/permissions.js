export const getTreeData = function(permissions, parent) {
  for (const item of permissions) {
    if (parent) {
      item.id = `${parent.id}::${item.permission}`;
    } else {
      item.id = item.permission;
    }
    if (item.children) {
      item.children = getTreeData(item.children, item);
    }
  }
  return permissions;
};
