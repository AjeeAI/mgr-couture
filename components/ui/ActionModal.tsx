"use client";

import React from 'react';

type ModalType = 'confirm' | 'success' | 'error' | 'loading';

interface ActionModalProps {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message: string;
  onConfirm?: () => void;
  onClose: () => void;
  confirmText?: string;
}

export default function ActionModal({
  isOpen,
  type,
  title,
  message,
  onConfirm,
  onClose,
  confirmText = "Confirm",
}: ActionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
      <div className="bg-mgr-surface border border-mgr-primary/20 w-full max-w-md p-8 relative shadow-2xl text-center">
        
        {/* Icon Header based on Modal Type */}
        <div className="flex justify-center mb-6">
          {type === 'confirm' && (
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          )}
          {type === 'success' && (
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          )}
          {type === 'error' && (
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
          )}
          {type === 'loading' && (
            <div className="w-12 h-12 rounded-full bg-mgr-primary/10 border border-mgr-primary/30 flex items-center justify-center text-mgr-primary animate-spin">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </div>
          )}
        </div>

        {/* Title & Message */}
        <h3 className="font-display text-2xl text-mgr-foreground mb-3">{title}</h3>
        <p className="font-body text-xs text-mgr-text-neutral leading-relaxed mb-8">{message}</p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          {type !== 'loading' && type !== 'success' && type !== 'error' && (
            <button
              onClick={onClose}
              className="flex-1 py-3 font-body text-xs text-mgr-text-neutral uppercase tracking-widest border border-mgr-primary/20 hover:border-mgr-primary/50 transition-colors"
            >
              Cancel
            </button>
          )}

          {type === 'confirm' ? (
            <button
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
              className="flex-1 py-3 bg-red-950/40 text-red-400 border border-red-500/40 font-body text-xs uppercase tracking-widest hover:bg-red-900/50 transition-all font-bold"
            >
              {confirmText}
            </button>
          ) : type === 'success' || type === 'error' ? (
            <button
              onClick={onClose}
              className="w-full py-3 bg-mgr-primary/20 text-mgr-primary border border-mgr-primary/50 font-body text-xs uppercase tracking-widest hover:bg-mgr-primary hover:text-mgr-background transition-all font-bold"
            >
              Dismiss
            </button>
          ) : null}
        </div>

      </div>
    </div>
  );
}