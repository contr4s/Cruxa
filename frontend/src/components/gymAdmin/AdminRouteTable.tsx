import type { RouteDto } from '../../types/route';
import { RouteTable } from '../routes/RouteTable';

interface AdminRouteTableProps {
  routes: RouteDto[];
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
}

export function AdminRouteTable({
  routes,
  selectable,
  selectedIds,
  onSelectionChange,
}: AdminRouteTableProps) {
  return (
    <RouteTable
      routes={routes}
      showStatus
      showSetter
      selectable={selectable}
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
    />
  );
}
