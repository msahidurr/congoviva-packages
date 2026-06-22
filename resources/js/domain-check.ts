// Secure domain verification system
// This file should be imported in your main app file

import React from 'react';
import { createRoot } from 'react-dom/client';
import SecureDomainGuard from './components/SecureDomainGuard';

// Initialize secure domain guard
const initSecureDomainGuard = () => {
  // Create guard container if it doesn't exist
  let guardContainer = document.getElementById('secure-domain-guard');
  if (!guardContainer) {
    guardContainer = document.createElement('div');
    guardContainer.id = 'secure-domain-guard';
    guardContainer.style.position = 'fixed';
    guardContainer.style.top = '0';
    guardContainer.style.left = '0';
    guardContainer.style.width = '100%';
    guardContainer.style.height = '100%';
    guardContainer.style.pointerEvents = 'none';
    guardContainer.style.zIndex = '999999';
    document.body.appendChild(guardContainer);
    
    // Render the guard component
    const root = createRoot(guardContainer);
    root.render(React.createElement(SecureDomainGuard));
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSecureDomainGuard);
} else {
  initSecureDomainGuard();
}

// Additional security: Monitor for tampering
const _securityCheck = () => {
  const guard = document.getElementById('secure-domain-guard');
  const host = window.location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '::1';
  
  if (!guard && !isLocal && (window.location.pathname.includes('login') || window.location.pathname.includes('register'))) {
    initSecureDomainGuard();
  }
};

// Run security check periodically (reduced frequency to minimize interference)
setInterval(_securityCheck, 30000); // Changed from 2000ms (2s) to 30000ms (30s)

export { initSecureDomainGuard };