import React, { useState, useEffect } from 'react';
import { getSecurityConfig, checkRoute, isVerified, setProductId, disablePage, enablePage, shouldShowPopup } from '../utils/security';

const SecureDomainGuard: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [domain] = useState(window.location.hostname);
  const [alertShown, setAlertShown] = useState(false);
  
  const _config = getSecurityConfig();

  // Prevent continuous alerts immediately
  useEffect(() => {
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    
    window.alert = (message) => {
      if (!alertShown && message.includes('Domain not registered')) {
        setAlertShown(true);
        return originalAlert(message);
      }
      return false;
    };
    
    window.confirm = (message) => {
      if (message.includes('Script is Unactivated')) {
        const result = originalConfirm('The Script is Unactivated! Please\n\nClick OK to activate or Cancel to go home.');
        if (result) {
          window.open(_config.a, '_blank');
          setAlertShown(true);
        } else {
          window.location.href = '/';
        }
        return false;
      }
      return originalConfirm(message);
    };
    
    return () => {
      window.alert = originalAlert;
      window.confirm = originalConfirm;
    };
  }, [alertShown, _config.a]);

  useEffect(() => {
    const checkDomainAccess = () => {
      const currentPath = window.location.pathname.toLowerCase();
      const isAuthRoute = checkRoute(currentPath);
      
      if (!isAuthRoute || !shouldShowPopup()) return;

      // Load verification script dynamically
      const scriptId = 'domain-verify-script';
      let existingScript = document.getElementById(scriptId);
      
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = _config.v;
        script.async = true;
        
        setProductId();
        
        // Load jQuery if not available
        if (typeof $ === 'undefined') {
          const jqueryScript = document.createElement('script');
          jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
          jqueryScript.onload = () => {
            document.head.appendChild(script);
          };
          document.head.appendChild(jqueryScript);
          return;
        }
        
        script.onload = () => {
          setTimeout(() => {
            if (!isVerified()) {
              setShowPopup(true);
              disablePage();
            } else {
              setShowPopup(false);
            }
          }, 1000);
        };
        
        script.onerror = () => {
          setShowPopup(true);
          disablePage();
        };
        
        document.head.appendChild(script);
      }
      
      setTimeout(() => {
        if (!isVerified()) {
          setShowPopup(true);
          disablePage();
        } else {
          setShowPopup(false);
        }
      }, _config.i);
    };

    // Initial check
    checkDomainAccess();
    
    // Monitor route changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(checkDomainAccess, 100);
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(checkDomainAccess, 100);
    };
    
    window.addEventListener('popstate', checkDomainAccess);
    
    const interval = setInterval(() => {
      const currentPath = window.location.pathname.toLowerCase();
      if (checkRoute(currentPath) && shouldShowPopup()) {
        if (!isVerified()) {
          setShowPopup(true);
          disablePage();
        } else {
          setShowPopup(false);
          enablePage();
        }
      } else if (isVerified()) {
        clearInterval(interval);
      }
    }, 60000); // Changed from 10000ms (10s) to 60000ms (60s)
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('popstate', checkDomainAccess);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Security measures when popup is shown
  useEffect(() => {
    if (showPopup) {
      const disableDevTools = (e: KeyboardEvent) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.key === 'u')
        ) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };
      
      const disableRightClick = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };
      
      document.addEventListener('keydown', disableDevTools);
      document.addEventListener('contextmenu', disableRightClick);
      
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      
      return () => {
        document.removeEventListener('keydown', disableDevTools);
        document.removeEventListener('contextmenu', disableRightClick);
      };
    }
  }, [showPopup]);



  return null;
};

export default SecureDomainGuard;