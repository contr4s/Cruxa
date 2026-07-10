import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth';
import { gymHandlers } from './handlers/gyms';
import { routeHandlers } from './handlers/routes';
import { postHandlers } from './handlers/posts';
import { userHandlers } from './handlers/users';
import { adminHandlers } from './handlers/admin';
import { routesetterHandlers } from './handlers/routesetter';
import { gymAdminHandlers } from './handlers/gymAdmin';
import { tagsHandlers, managedGymHandlers, mediaHandlers, gradingSystemHandlers } from './handlers/misc';

const shouldLog = () => import.meta.env.VITE_DEBUG === 'true' || import.meta.env.DEV;

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
  ...gradingSystemHandlers,
);

if (shouldLog()) {
  worker.events.on('request:start', ({ request }) => {
    console.log('[MSW] ➡ %s %s', request.method, request.url);
  });

  worker.events.on('request:match', ({ request }) => {
    console.log('[MSW] ✓ %s %s', request.method, request.url);
  });

  worker.events.on('request:unhandled', ({ request }) => {
    console.warn('[MSW] ? %s %s — no handler', request.method, request.url);
  });
}
