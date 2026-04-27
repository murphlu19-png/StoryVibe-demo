export const IS_MOCK_DEMO = import.meta.env.VITE_MOCK_DEMO !== 'false';

export function shouldBypassExternalData(): boolean {
  return IS_MOCK_DEMO;
}
