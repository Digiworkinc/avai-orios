/**
 * Admin Debug Panel
 * Development-only panel to help debug authentication issues
 */

import React, { useState } from 'react';
import { AlertCircle, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { isDevAdminMode, setDevAdmin, isDevelopmentMode } from '../lib/adminHelper';

interface AdminDebugPanelProps {
  user: any;
  isAdmin: boolean;
  userEmail?: string;
}

export const AdminDebugPanel: React.FC<AdminDebugPanelProps> = ({ user, isAdmin, userEmail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isDevelopmentMode()) {
    return null;
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-900/30 border border-yellow-600/50 text-yellow-400 text-xs font-bold hover:bg-yellow-900/40 transition-colors"
      >
        <AlertCircle size={14} />
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        Dev Debug
      </button>

      {isOpen && (
        <div className="mt-2 p-4 rounded-lg bg-brand-surface border border-yellow-600/30 text-xs space-y-3 text-gray-300">
          {/* User Info */}
          <div>
            <div className="font-bold text-yellow-400 mb-1">👤 User Info</div>
            <div className="space-y-1 text-xs break-all">
              <div>Email: <span className="text-white">{user?.email || 'Not logged in'}</span></div>
              <div>UID: <span className="text-white truncate">{user?.uid || 'N/A'}</span></div>
              <div>Verified: <span className="text-white">{user?.emailVerified ? '✅ Yes' : '❌ No'}</span></div>
            </div>
          </div>

          {/* Admin Status */}
          <div>
            <div className="font-bold text-cyan-400 mb-1">🔑 Admin Status</div>
            <div className="space-y-1">
              <div>Is Admin: <span className={isAdmin ? 'text-green-400' : 'text-red-400'}>{isAdmin ? '✅ Yes' : '❌ No'}</span></div>
              <div>Dev Override: <span className={isDevAdminMode() ? 'text-green-400' : 'text-gray-500'}>{isDevAdminMode() ? '✅ Enabled' : '❌ Disabled'}</span></div>
            </div>
          </div>

          {/* Hardcoded Admin Email */}
          <div>
            <div className="font-bold text-blue-400 mb-1">📧 Hardcoded Admin</div>
            <div className="flex items-center gap-2">
              <span className="font-mono truncate">eleazaragung...</span>
              <button
                onClick={() => handleCopy('eleazaragungnugroho@gmail.com')}
                className="p-1 hover:bg-white/10 rounded"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>

          {/* Dev Admin Toggle */}
          {user && (
            <div>
              <div className="font-bold text-purple-400 mb-2">⚙️ Dev Tools</div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setDevAdmin(true);
                    window.location.reload();
                  }}
                  className="flex-1 px-2 py-1 rounded bg-green-900/40 border border-green-600/50 text-green-400 hover:bg-green-900/60 text-xs font-bold"
                >
                  Enable Admin
                </button>
                <button
                  onClick={() => {
                    setDevAdmin(false);
                    window.location.reload();
                  }}
                  className="flex-1 px-2 py-1 rounded bg-red-900/40 border border-red-600/50 text-red-400 hover:bg-red-900/60 text-xs font-bold"
                >
                  Disable Admin
                </button>
              </div>
            </div>
          )}

          {/* Console Commands */}
          <div>
            <div className="font-bold text-gray-400 mb-1">💻 Console Commands</div>
            <div className="bg-brand-dark/50 p-2 rounded text-xs space-y-1 font-mono">
              <div className="text-gray-500">Run in DevTools Console:</div>
              <div className="flex items-center gap-1">
                <span>window.enableTestAdmin()</span>
                <button onClick={() => handleCopy('window.enableTestAdmin()')} className="ml-auto text-xs opacity-50 hover:opacity-100">
                  <Copy size={12} />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <span>window.disableTestAdmin()</span>
                <button onClick={() => handleCopy('window.disableTestAdmin()')} className="ml-auto text-xs opacity-50 hover:opacity-100">
                  <Copy size={12} />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <span>window.checkAdminStatus()</span>
                <button onClick={() => handleCopy('window.checkAdminStatus()')} className="ml-auto text-xs opacity-50 hover:opacity-100">
                  <Copy size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="pt-2 border-t border-white/10 text-xs text-gray-400">
            <strong>⚠️ Development Mode Only</strong>
            <p className="mt-1">This debug panel is only visible in development. Use it to troubleshoot authentication issues.</p>
          </div>

          {copied && (
            <div className="text-center text-green-400 text-xs">✅ Copied!</div>
          )}
        </div>
      )}
    </div>
  );
};
