import type { RouteDto } from '../../types/route';
import { RouteTable } from '../routes/RouteTable';

interface SetterRouteTableProps {
  routes: RouteDto[];
  onEdit?: (route: RouteDto) => void;
  onArchive?: (route: RouteDto) => void;
  onRestore?: (route: RouteDto) => void;
}

export function SetterRouteTable({ routes, onEdit, onArchive, onRestore }: SetterRouteTableProps) {
  return (
    <RouteTable
      routes={routes}
      showStatus
      showActions
      onEdit={onEdit}
      onArchive={onArchive}
      onRestore={onRestore}
    />
  );
}
