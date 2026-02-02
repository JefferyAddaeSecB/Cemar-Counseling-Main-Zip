/**
 * Console Protection Utilities
 * Adds security measures to protect against console-based attacks
 */

// Disable console in production
export const disableConsoleInProduction = () => {
  if (import.meta.env.PROD) {
    const noop = () => {};
    const consoleOverrides = {
      log: noop,
      warn: noop,
      error: noop,
      info: noop,
      debug: noop,
      trace: noop,
      table: noop,
      group: noop,
      groupCollapsed: noop,
      groupEnd: noop,
      clear: noop,
      count: noop,
      countReset: noop,
      time: noop,
      timeEnd: noop,
      timeLog: noop,
      dir: noop,
      dirxml: noop,
      assert: noop,
    };
    
    Object.keys(consoleOverrides).forEach((key) => {
      (console as any)[key] = consoleOverrides[key as keyof typeof consoleOverrides];
    });
  }
};

// Detect DevTools
export const detectDevTools = () => {
  if (import.meta.env.PROD) {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
      console.clear();
      document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;"><div><h1>⚠️ Developer Tools Detected</h1><p>For security reasons, this application cannot be used with developer tools open.</p><p>Please close the developer tools and refresh the page.</p></div></div>';
    }
  }
};

// Prevent right-click in production
export const disableRightClick = () => {
  if (import.meta.env.PROD) {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
  }
};

// Prevent keyboard shortcuts for DevTools
export const disableDevToolsShortcuts = () => {
  if (import.meta.env.PROD) {
    document.addEventListener('keydown', (e) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+S (Save Page)
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
        e.preventDefault();
        return false;
      }
    });
  }
};

// Add warning message to console
export const addConsoleWarning = () => {
  if (import.meta.env.PROD) {
    const style = 'color: red; font-size: 20px; font-weight: bold;';
    console.log('%c⚠️ WARNING ⚠️', style);
    console.log('%cThis is a browser feature intended for developers.', 'font-size: 16px;');
    console.log('%cIf someone told you to copy/paste something here, it is likely a scam.', 'font-size: 16px;');
    console.log('%cPasting anything here could give attackers access to your account.', 'font-size: 16px; color: red;');
  }
};

// Monitor for debugging attempts
export const antiDebugger = () => {
  if (import.meta.env.PROD) {
    setInterval(() => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      
      // If debugger was hit, time difference will be significant
      if (end - start > 100) {
        window.location.reload();
      }
    }, 1000);
  }
};

// Initialize all protections
export const initializeConsoleProtection = () => {
  addConsoleWarning();
  disableConsoleInProduction();
  disableRightClick();
  disableDevToolsShortcuts();
  
  // Check for DevTools periodically
  setInterval(detectDevTools, 1000);
  
  // Optional: Enable anti-debugger (can be aggressive)
  // antiDebugger();
};
