import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import './theme/variables.css';
import App from './App.tsx';

// ── Global error handlers ──────────────────────
window.addEventListener('error', (event) => {
  console.error('[Global] Uncaught error:', event.error ?? event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Global] Unhandled rejection:', event.reason);
});

const shouldLog = () => import.meta.env.VITE_DEBUG === 'true' || import.meta.env.DEV;

async function startApp() {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    // Unregister stale service workers from previous scope registrations
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const reg of registrations) {
      if (reg.active?.scriptURL.includes('mockServiceWorker')) {
        await reg.unregister();
      }
    }
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'warn' });
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  queryClient.getQueryCache().subscribe((event) => {
    if (event?.query?.state?.error && shouldLog()) {
      console.error('[RQ] Query error:', event.query.state.error);
    }
  });

  queryClient.getMutationCache().subscribe((event) => {
    if (event?.mutation?.state?.error && shouldLog()) {
      console.error('[RQ] Mutation error:', event.mutation.state.error);
    }
  });

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
}

startApp();
