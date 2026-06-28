const PLACEHOLDER = "__VITE_API_URL__";
const DEV_FALLBACK = "http://localhost:8080";
const PROD_FALLBACK = "https://reqnest.onrender.com";

export const getApiUrl = () => {
  const runtimeUrl = window._env_?.VITE_API_URL;
  const viteUrl = import.meta.env.VITE_API_URL;

  if (runtimeUrl && runtimeUrl !== PLACEHOLDER) {
    return runtimeUrl;
  }

  if (viteUrl && viteUrl !== PLACEHOLDER) {
    return viteUrl;
  }

  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return DEV_FALLBACK;
  }

  return PROD_FALLBACK;
};