import { readonly, ref } from 'vue';

export type ViewMode = 'resume' | 'chat';

/** Module-scoped: every consumer (Header, App) shares the same mode. */
const mode = ref<ViewMode>('resume');

export function useViewMode() {
  function setMode(next: ViewMode): void {
    mode.value = next;
  }

  return { mode: readonly(mode), setMode };
}
