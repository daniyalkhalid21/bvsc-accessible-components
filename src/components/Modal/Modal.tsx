import React, { useEffect, useId, useRef } from 'react';
import './Modal.css';
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
export interface ModalProps { open: boolean; onClose: () => void; title: string; description?: React.ReactNode; children?: React.ReactNode; footer?: React.ReactNode; }
/** Native <dialog> opened with showModal(): inert background, Escape, top layer. We add focus restore, scroll lock and a Tab wrap fallback. */
export function Modal({ open, onClose, title, description, children, footer }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null); const tid = useId(); const did = useId(); const returnTo = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const d = ref.current; if (!d) return;
    if (open && !d.open) {
      returnTo.current = document.activeElement as HTMLElement | null;
      d.showModal(); document.body.style.overflow = 'hidden';
      const target = d.querySelector<HTMLElement>('[data-autofocus]') ?? d.querySelector<HTMLElement>(FOCUSABLE) ?? d;
      target.focus();
    } else if (!open && d.open) { d.close(); }
    if (!open) { document.body.style.overflow = ''; returnTo.current?.focus?.(); returnTo.current = null; }
  }, [open]);
  useEffect(() => () => { document.body.style.overflow = ''; }, []);
  const onKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
    if (e.key !== 'Tab') return;
    const f = [...e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)]; if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  return (
    <dialog ref={ref} className="bv-modal" aria-labelledby={tid} aria-describedby={description ? did : undefined} onKeyDown={onKeyDown}
      onCancel={(e) => { e.preventDefault(); onClose(); }} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className="bv-modal__body">
        <div className="bv-modal__head">
          <h2 id={tid} className="bv-modal__title">{title}</h2>
          <button type="button" className="bv-modal__close" aria-label="Close dialog" onClick={onClose}>
            <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 18 18"><path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2.5" fill="none"/></svg>
          </button>
        </div>
        {description && <p id={did} className="bv-modal__desc">{description}</p>}
        {children}
        {footer && <div className="bv-modal__footer">{footer}</div>}
      </div>
    </dialog>
  );
}
