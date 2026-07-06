import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth';
import { gymHandlers } from './handlers/gyms';
import { routeHandlers } from './handlers/routes';
import { postHandlers } from './handlers/posts';
import { userHandlers } from './handlers/users';
import { adminHandlers } from './handlers/admin';
import { routesetterHandlers } from './handlers/routesetter';
import { gymAdminHandlers } from './handlers/gymAdmin';
import { tagsHandlers, managedGymHandlers, mediaHandlers } from './handlers/misc';

export const worker = setupWorker(
  ...authHandlers,
  ...gymHandlers,
  ...routeHandlers,
  ...postHandlers,
  ...userHandlers,
  ...adminHandlers,
  ...routesetterHandlers,
  ...gymAdminHandlers,
  ...tagsHandlers,
  ...managedGymHandlers,
  ...mediaHandlers,
);
