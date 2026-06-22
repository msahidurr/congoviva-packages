// Security utilities - obfuscated
const _0x1a2b = ['MzQ4ODUzOTc=', 'aHR0cHM6Ly9lbnZhdG8ud29ya2RvLmlvL3ZlcmlmeS5qcw==', 'aHR0cHM6Ly9lbnZhdG8ud29ya2RvLmlvL2FjdGl2YXRl', 'bG9naW4=', 'cmVnaXN0ZXI='];
const _0x3c4d = (index: number) => atob(_0x1a2b[index]);

export const getSecurityConfig = () => ({
  p: _0x3c4d(0),
  v: _0x3c4d(1), 
  a: _0x3c4d(2),
  r: [_0x3c4d(3), _0x3c4d(4)],
  i: 3000
});

export const checkRoute = (path: string): boolean => {
  const config = getSecurityConfig();
  return config.r.some(route => path.toLowerCase().includes(route));
};

export const isLocalhost = (): boolean => {
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
};

export const shouldShowPopup = (): boolean => {
  if (isLocalhost()) return false;
  
  const appUrl = (window as any).Laravel?.app_url || document.querySelector('meta[name="app-url"]')?.getAttribute('content');
  if (!appUrl) return true;
  
  const appHost = new URL(appUrl).hostname;
  const currentHost = window.location.hostname;
  
  return appHost !== currentHost;
};

export const isVerified = (): boolean => {
  return (window as any).product_verified === true;
};

export const setProductId = (): void => {
  (window as any).product_id = getSecurityConfig().p;
};

export const disablePage = (): void => {
  document.body.style.pointerEvents = 'none';
  document.body.style.userSelect = 'none';
  document.body.style.webkitUserSelect = 'none';
};

export const enablePage = (): void => {
  document.body.style.pointerEvents = 'auto';
  document.body.style.userSelect = 'auto';
  document.body.style.webkitUserSelect = 'auto';
};