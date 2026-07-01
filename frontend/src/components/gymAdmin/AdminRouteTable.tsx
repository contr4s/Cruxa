import type { RouteDto } from '../../types/route';
import { RouteTable } from '../routes/RouteTable';

interface AdminRouteTableProps {
  routes: RouteDto[];
}

export function AdminRouteTable({ routes }: AdminRouteTableProps) {
  return (
    <RouteTable
      routes={routes}
      showStatus
      showSetter
    />
  );
}
