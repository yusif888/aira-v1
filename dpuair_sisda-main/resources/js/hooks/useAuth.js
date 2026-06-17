import { usePage } from "@inertiajs/react";

export const useAuth = () => {
    const { auth } = usePage().props;

    /**
     * Check if user has a specific role.
     * @param {string} name
     * @returns {boolean}
     */
    const hasRole = (name) => auth.roles.includes(name);

    /**
     * Check if user has a specific permission.
     * @param {string} name
     * @returns {boolean}
     */
    const hasPermission = (name) => auth.permissions.includes(name);

    /**
     * Check if user has any of the given permissions.
     * @param {string[]} permissions
     * @returns {boolean}
     */
    const hasAnyPermission = (permissions) =>
        permissions.some((permission) => auth.permissions.includes(permission));

    /**
     * Check if user has all of the given permissions.
     * @param {string[]} permissions
     * @returns {boolean}
     */
    const hasAllPermissions = (permissions) =>
        permissions.every((permission) =>
            auth.permissions.includes(permission)
        );

    return {
        user: auth.user,
        roles: auth.roles,
        permissions: auth.permissions,
        hasRole,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
    };
};
