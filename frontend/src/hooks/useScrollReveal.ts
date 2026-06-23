import { useEffect, useRef } from 'react';

function throttle<T extends (...args: unknown[]) => void>(fn: T): T {
  let ticking = false;
  return ((...args: unknown[]) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        fn(...args);
        ticking = false;
      });
      ticking = true;
    }
  }) as T;
}

export function useScrollReveal(threshold = 0.15) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const mutationRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );
    observerRef.current = observer;

    const observeNew = throttle(() => {
      document.querySelectorAll('.scroll-reveal:not(.visible)').forEach((el) => {
        observer.observe(el);
      });
    });

    // Первичная подписка
    observeNew();

    // Следим за добавлением новых .scroll-reveal в DOM (с rAF throttle)
    const mutation = new MutationObserver(observeNew);
    mutation.observe(document.body, { childList: true, subtree: true });
    mutationRef.current = mutation;

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, [threshold]);
}
