import { authorizedFetch } from './client';

export function getMe() {
  return authorizedFetch('/users/me');
}
