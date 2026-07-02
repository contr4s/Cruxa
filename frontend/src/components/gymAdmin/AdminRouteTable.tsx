import type { RouteDto } from '../../types/route';
import { RouteTable } from '../routes/RouteTable';

interface AdminRouteTableProps {
  routes: RouteDto[];
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  onEdit?: (route: RouteDto) => void;
}

export function AdminRouteTable({
  routes,
  selectable,
  selectedIds,
  onSelectionChange,
  onEdit,
}: AdminRouteTableProps) {
  return (
    <RouteTable
      routes={routes}
      showStatus
      showSetter
      showActions
      selectable={selectable}
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      onEdit={onEdit}
    />
  );
}
