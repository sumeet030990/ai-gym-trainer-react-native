import { authorizedFetch } from './client';

// The backend only exposes a paginated list, so a large pageSize is used to fetch
// the full catalog in one call for client-side filtering.
export function getEquipments({ page = 1, pageSize = 100 } = {}) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('page_size', String(pageSize));
  return authorizedFetch(`/equipments/?${params.toString()}`);
}
