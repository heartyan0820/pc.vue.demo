import { useUserStore } from "@/store";
const hasPerm = {
  mounted(el, binding) {
    const requiredPerms = binding.value;
    if (!requiredPerms || typeof requiredPerms !== "string" && !Array.isArray(requiredPerms)) {
      throw new Error(
        `需要提供权限标识！例如：v-has-perm="'sys:user:add'" 或 v-has-perm="['sys:user:add', 'sys:user:edit']"`
      );
    }
    const { roles, perms } = useUserStore().userInfo;
    if (roles.includes("ROOT")) {
      return;
    }
    const hasAuth = Array.isArray(requiredPerms) ? requiredPerms.some((perm) => perms.includes(perm)) : perms.includes(requiredPerms);
    if (!hasAuth && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }
};
const hasRole = {
  mounted(el, binding) {
    const requiredRoles = binding.value;
    if (!requiredRoles || typeof requiredRoles !== "string" && !Array.isArray(requiredRoles)) {
      throw new Error(
        `需要提供角色标识！例如：v-has-role="'ADMIN'" 或 v-has-role="['ADMIN', 'TEST']"`
      );
    }
    const { roles } = useUserStore().userInfo;
    const hasAuth = Array.isArray(requiredRoles) ? requiredRoles.some((role) => roles.includes(role)) : roles.includes(requiredRoles);
    if (!hasAuth && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }
};
export {
  hasPerm,
  hasRole
};
