import type { RouteDto } from '../../types/route';
import { RouteTable } from '../routes/RouteTable';

interface SetterRouteTableProps {
  routes: RouteDto[];
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  onEdit?: (route: RouteDto) => void;
  onArchive?: (route: RouteDto) => void;
  onRestore?: (route: RouteDto) => void;
}

export function SetterRouteTable({
  routes,
  selectable,
  selectedIds,
  onSelectionChange,
  onEdit,
  onArchive,
  onRestore,
}: SetterRouteTableProps) {
  return (
    <RouteTable
      routes={routes}
      showStatus
      showActions
      selectable={selectable}
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      onEdit={onEdit}
      onArchive={onArchive}
      onRestore={onRestore}
    />
  );
}
