import { useRef, useState, useEffect } from 'react';

interface UseInViewOptions {
  threshold?: number;
  triggerOnce?: boolean;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(options?: UseInViewOptions) {
  const { threshold = 0.2, triggerOnce = true } = options ?? {};
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(!triggerOnce);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (triggerOnce && inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerOnce]);

  return { ref, inView };
}
