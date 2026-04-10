/**
 * Development Admin Helper
 * Allows testing admin features during development
 */

const DEV_ADMIN_KEY = 'avai_orios_dev_admin';
const DEV_TEST_EMAILS = [
  'eleazaragungnugroho@gmail.com', // Hardcoded admin
  'admin@example.com', // Test admin
  'test@example.com', // Test user
];

/**
 * Check if current environment is development
 * Works with both Vite and standard environments
 */
export function isDevelopmentMode() {
  // Check localStorage flag first for override
  if (typeof window !== 'undefined') {
    // Check if host is localhost or Codespaces
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('github.dev') ||
                       window.location.hostname.includes('githubpreview.dev');
    return isLocalhost;
  }
  return false;
}

/**
 * Set dev admin mode (for testing only)
 */
export function setDevAdmin(isAdmin: boolean) {
  if (isDevelopmentMode()) {
    if (isAdmin) {
      localStorage.setItem(DEV_ADMIN_KEY, 'true');
    } else {
      localStorage.removeItem(DEV_ADMIN_KEY);
    }
  }
}

/**
 * Check if dev admin mode is enabled
 */
export function isDevAdminMode() {
  return isDevelopmentMode() && localStorage.getItem(DEV_ADMIN_KEY) === 'true';
}

/**
 * Log admin status for debugging
 */
export function logAdminDebug(email: string | null | undefined, role: string | null) {
  console.group('🔑 Admin Debug Info');
  console.log('Email:', email);
  console.log('Role:', role);
  console.log('Dev Mode:', isDevelopmentMode());
  console.log('Dev Admin Override:', isDevAdminMode());
  console.log('Hardcoded Admin:', email === 'eleazaragungnugroho@gmail.com');
  console.log('Test Emails:', DEV_TEST_EMAILS);
  console.groupEnd();
}

/**
 * Enable test admin mode from console
 * Run in browser console: window.enableTestAdmin()
 */
(window as any).enableTestAdmin = function() {
  setDevAdmin(true);
  console.info('✅ Test admin enabled. Refresh page to take effect.');
  console.info('📝 Test emails:', DEV_TEST_EMAILS);
};

/**
 * Disable test admin mode
 */
(window as any).disableTestAdmin = function() {
  setDevAdmin(false);
  console.info('✅ Test admin disabled. Refresh page to take effect.');
};

/**
 * Show current admin status
 */
(window as any).checkAdminStatus = function() {
  console.log('Dev Admin Mode:', isDevAdminMode());
  console.log('Dev Mode:', isDevelopmentMode());
  console.log('Hardcoded Admin Email:', DEV_TEST_EMAILS[0]);
};
