/**
 * Utility function to get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

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

/**
 * Utility function to delete a cookie
 */
export function deleteCookie(name: string): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
}
