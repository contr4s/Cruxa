import { RouteFilters, type RouteFiltersValues } from '../ui/RouteFilters';
import type { SetterRouteFilterState } from '../../types/routesetter';

interface SetterRouteFiltersProps {
  filters: SetterRouteFilterState;
  onChange: (filters: SetterRouteFilterState) => void;
  gyms: { id: string; name: string }[];
  filterTrigger?: (bag: { open: boolean; toggle: () => void; activeCount: number }) => React.ReactNode;
}

/** Wrapper */
export function SetterRouteFilters({ filters, onChange, gyms, filterTrigger }: SetterRouteFiltersProps) {
  return (
    <RouteFilters
      filters={filters as unknown as RouteFiltersValues}
      onChange={(v) => onChange({ ...filters, ...v })}
      slots={{ gyms }}
      filterTrigger={filterTrigger}
    />
  );
}
