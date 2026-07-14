import type { Directive } from 'vue';

/**
 * v-reveal — staggered reveal-on-scroll. Usage:
 *   <div v-reveal />          — reveals with no delay
 *   <div v-reveal="120" />    — reveals with a 120ms stagger delay
 * After the transition, the attribute and classes are removed so element transitions (e.g. Tailwind `transition-colors`) fully revert.
 */

const REVEAL_DURATION_MS = 700;

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const el = entry.target as HTMLElement;
        observer?.unobserve(el);
        el.classList.add('is-revealed');

        const delay = Number.parseInt(el.style.getPropertyValue('--reveal-delay')) || 0;
        window.setTimeout(() => {
          el.removeAttribute('data-reveal');
          el.classList.remove('is-revealed');
          el.style.removeProperty('--reveal-delay');
        }, delay + REVEAL_DURATION_MS);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
  );

  return observer;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    if (prefersReducedMotion()) return;

    el.setAttribute('data-reveal', '');
    if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`);
    getObserver().observe(el);
  },

  unmounted(el) {
    observer?.unobserve(el);
  },
};
