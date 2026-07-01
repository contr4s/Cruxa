import { RouteFilters, type RouteFiltersValues } from '../ui/RouteFilters';
import type { AdminRouteFilterState } from '../../types/gymAdmin';

interface AdminRouteFiltersProps {
  filters: AdminRouteFilterState;
  onChange: (filters: AdminRouteFilterState) => void;
  sectors: { id: string; name: string }[];
  setters: { id: string; name: string }[];
  filterTrigger?: (bag: { open: boolean; toggle: () => void; activeCount: number }) => React.ReactNode;
}

/** Wrapper */
export function AdminRouteFilters({ filters, onChange, sectors, setters, filterTrigger }: AdminRouteFiltersProps) {
  return (
    <RouteFilters
      filters={filters as unknown as RouteFiltersValues}
      onChange={(v) => onChange({ ...filters, ...v })}
      slots={{ sectors, setters }}
      filterTrigger={filterTrigger}
    />
  );
}

