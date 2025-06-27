// IMPORTANT:
// To prevent accidental leakage of environment variables to the client,
// only variables prefixed with `VITE_` are exposed by Vite.
// This is a security feature to ensure that sensitive keys (e.g., database passwords, secret keys)
// are not included in the client-side bundle.
// See: https://vitejs.dev/guide/env-and-mode.html#env-variables-and-modes

export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
export const API_ICONS_ENDPOINT = import.meta.env.VITE_API_ICON_ENDPOINT;
