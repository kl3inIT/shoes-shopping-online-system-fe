import { type PermissionRequirement } from './permissions';
import { usePermission } from './usePermission';

type PermissionedItem = {
  requirement?: PermissionRequirement;
};

export function useAuthorizedItems<T extends PermissionedItem>(
  items: readonly T[]
) {
  const permission = usePermission();

  if (permission.isLoading) {
    return [] as T[];
  }

  return items.filter((item) => permission.canAccess(item.requirement));
}
