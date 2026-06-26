const PLACEHOLDER = "__VITE_API_URL__";
const DEV_FALLBACK = "http://localhost:8080";

export const getApiUrl = () => {
  const runtimeUrl = window._env_?.VITE_API_URL;
  const viteUrl = import.meta.env.VITE_API_URL;

  if (runtimeUrl && runtimeUrl !== PLACEHOLDER) {
    return runtimeUrl;
  }

  if (viteUrl && viteUrl !== PLACEHOLDER) {
    return viteUrl;
  }

  return DEV_FALLBACK;
};