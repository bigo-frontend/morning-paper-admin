import Vue from 'vue';
import store from '@/store';

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *
 */
const action = Vue.directive('action', {
  inserted: function(el, binding, vnode) {
    const isSuperadmin = store.state.user.isSuperadmin;
    if (isSuperadmin) {
      return;
    }
    const actionName = binding.arg;
    const actionPermissions = store.getters['permission/actionPermissions'];
    const permissionIds = actionPermissions.map(item => item.id);
    let permissionId = (vnode.context.$route.matched || []).filter(item => item.meta && item.meta.permission).map(item => {
      return item.meta.permission;
    }).join('::');
    if (actionName) {
      permissionId = `${permissionId}::${actionName}`;
    }
    if (!permissionIds.includes(permissionId)) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none');
    }
  }
});

Vue.prototype.hasPermission = function(actionName) {
  const isSuperadmin = store.state.user.isSuperadmin;
  if (isSuperadmin) {
    return true;
  }
  const actionPermissions = store.getters['permission/actionPermissions'];
  const permissionIds = actionPermissions.map(item => item.id);
  let permissionId = (this.$route.matched || []).filter(item => item.meta && item.meta.permission).map(item => {
    return item.meta.permission;
  }).join('::');
  if (actionName) {
    permissionId = `${permissionId}::${actionName}`;
  }
  return permissionIds.includes(permissionId);
};

export default action;
