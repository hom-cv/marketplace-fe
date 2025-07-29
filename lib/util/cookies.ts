import Cookies from "js-cookie";

// Utility to read a cookie by name - first try js-cookie, then fallback to document.cookie
export function getCookie(name: string): string | null {
  // Try to get cookie using js-cookie first (more reliable)
  const jsCookie = Cookies.get(name);
  if (jsCookie) return jsCookie;

  // Fallback to document.cookie parsing
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

/**
 * Utility function to set a cookie
 */
export function setCookie(
  name: string,
  value: string,
  days: number = 7,
  options?: {
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
    domain?: string;
  }
): void {
  if (typeof document === "undefined") {
    return;
  }

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  let cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/`;

  if (options?.secure) {
    cookieString += ";Secure";
  }
  if (options?.sameSite) {
    cookieString += `;SameSite=${options.sameSite}`;
  }
  if (options?.domain) {
    cookieString += `;Domain=${options.domain}`;
  }

  document.cookie = cookieString;
}

// Utility to remove a cookie
export function removeCookie(name: string): void {
  Cookies.remove(name, {
    path: "/",
    secure: window.location.protocol === "https:",
    sameSite: "Lax",
  });
}
