import { useSyncExternalStore } from "react";

const tokenKey = "access_token";
const authChangeEvent = "auth-token-change";

function emitAuthChange() {
  window.dispatchEvent(new Event(authChangeEvent));
}

export function getToken() {
  return localStorage.getItem(tokenKey);
}

export function setToken(token: string) {
  localStorage.setItem(tokenKey, token);
  emitAuthChange();
}

export function clearToken() {
  localStorage.removeItem(tokenKey);
  emitAuthChange();
}

export function useToken() {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(authChangeEvent, onStoreChange);
      window.addEventListener("storage", onStoreChange);

      return () => {
        window.removeEventListener(authChangeEvent, onStoreChange);
        window.removeEventListener("storage", onStoreChange);
      };
    },
    getToken,
    () => null,
  );
}
