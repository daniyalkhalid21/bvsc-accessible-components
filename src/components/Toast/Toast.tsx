import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import './Toast.css';
export type ToastKind = 'info' | 'success' | 'error';
export interface ToastData { id: number; kind: ToastKind; message: string; duration?: number; }
const Ctx = createContext<{ show: (kind: ToastKind, message: string, duration?: number) => number; dismiss: (id: number) => void } | null>(null);
export const useToast = () => { const c = useContext(Ctx); if (!c) throw new Error('useToast must be used inside <ToastProvider>'); return c; };

function ToastItem({ t, onDismiss }: { t: ToastData; onDismiss: (id: number) => void }) {
  const [paused, setPaused] = useState(false); const remaining = useRef(t.duration ?? 6000); const started = useRef(0);
  const auto = t.kind !== 'error'; // errors persist until dismissed
  useEffect(() => {
    if (!auto || paused) return;
    started.current = Date.now(); const h = setTimeout(() => onDismiss(t.id), remaining.current);
    return () => { clearTimeout(h); remaining.current -= Date.now() - started.current; };
  }, [auto, paused, t.id, onDismiss]);
  return (
    <div className={`bv-toast bv-toast--${t.kind}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); onDismiss(t.id); } }}>
      <p className="bv-toast__msg"><span className="visually-hidden">{t.kind === 'error' ? 'Error: ' : t.kind === 'success' ? 'Success: ' : 'Notice: '}</span>{t.message}</p>
      <button type="button" className="bv-toast__close" onClick={() => onDismiss(t.id)} aria-label={`Dismiss notification: ${t.message}`}>
        <svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2.5" fill="none"/></svg>
      </button>
    </div>
  );
}
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]); const n = useRef(0);
  const dismiss = useCallback((id: number) => setToasts(a => a.filter(x => x.id !== id)), []);
  const show = useCallback((kind: ToastKind, message: string, duration?: number) => { const id = ++n.current; setToasts(a => [...a, { id, kind, message, duration }]); return id; }, []);
  return (
    <Ctx.Provider value={{ show, dismiss }}>
      {children}
      {/* Both live regions are always mounted so assistive tech registers them before content arrives. */}
      <div className="bv-toasts">
        <div role="status" aria-live="polite" aria-atomic="false" className="bv-toasts__region">{toasts.filter(t => t.kind !== 'error').map(t => <ToastItem key={t.id} t={t} onDismiss={dismiss} />)}</div>
        <div role="alert" aria-atomic="false" className="bv-toasts__region">{toasts.filter(t => t.kind === 'error').map(t => <ToastItem key={t.id} t={t} onDismiss={dismiss} />)}</div>
      </div>
    </Ctx.Provider>
  );
}
