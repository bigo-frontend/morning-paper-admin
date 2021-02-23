const TokenKey = 'token';
const homePageUrl = `${location.protocol}//${location.host}`;

export function getToken() {
  return localStorage.getItem(TokenKey);
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token);
}

export function removeToken() {
  return localStorage.removeItem(TokenKey);
}

export function login() {
  window.location.href = `${process.env.VUE_APP_BASE_API}/auth/getToken?redirect=${encodeURIComponent(homePageUrl)}`;
}

export async function logout() {
  window.location.href = `${process.env.VUE_APP_BASE_API}/auth/logout?redirect=${encodeURIComponent(homePageUrl)}`;
}
