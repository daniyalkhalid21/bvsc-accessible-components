import React, { useEffect, useId, useRef, useState } from 'react';
import './Menu.css';
export interface MenuItem { id: string; label: string; onSelect?: () => void; disabled?: boolean; }
export function Menu({ label, items }: { label: string; items: MenuItem[] }) {
  const base = useId(); const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null); const wrap = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]); const typed = useRef({ s: '', t: 0 });
  const enabled = items.map((it, i) => (it.disabled ? -1 : i)).filter(i => i >= 0);
  const focusAt = (i: number) => refs.current[i]?.focus();
  const [pending, setPending] = useState<'first' | 'last' | null>(null);
  useEffect(() => { if (open && pending) { focusAt(pending === 'first' ? enabled[0] : enabled[enabled.length - 1]); setPending(null); } }, [open, pending]);
  const close = (restore = true) => { setOpen(false); if (restore) btn.current?.focus(); };
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const onButtonKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setPending('first'); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); setPending('last'); }
  };
  const onMenuKey = (e: React.KeyboardEvent) => {
    const cur = refs.current.findIndex(r => r === document.activeElement); const pos = enabled.indexOf(cur);
    let t = -1;
    if (e.key === 'ArrowDown') t = enabled[(pos + 1) % enabled.length]; else if (e.key === 'ArrowUp') t = enabled[(pos - 1 + enabled.length) % enabled.length];
    else if (e.key === 'Home') t = enabled[0]; else if (e.key === 'End') t = enabled[enabled.length - 1];
    else if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    else if (e.key === 'Tab') { close(false); return; }
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && e.key !== ' ') {
      const now = Date.now(); typed.current.s = now - typed.current.t > 700 ? e.key.toLowerCase() : typed.current.s + e.key.toLowerCase(); typed.current.t = now;
      const order = [...enabled.slice(pos + 1), ...enabled.slice(0, pos + 1)];
      const m = order.find(i => items[i].label.toLowerCase().startsWith(typed.current.s)); if (m !== undefined) { e.preventDefault(); focusAt(m); } return;
    }
    if (t >= 0) { e.preventDefault(); focusAt(t); }
  };
  return (
    <div className="bv-menu" ref={wrap}>
      <button ref={btn} type="button" className="bv-menu__btn" aria-haspopup="menu" aria-expanded={open} aria-controls={open ? `${base}-menu` : undefined}
        onClick={() => { setOpen(o => !o); }} onKeyDown={onButtonKey}>
        {label}<svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 16 16"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
      </button>
      {open && (
        <ul role="menu" id={`${base}-menu`} aria-label={label} className="bv-menu__list" onKeyDown={onMenuKey}>
          {items.map((it, i) => (
            <li role="none" key={it.id}>
              <button ref={el => (refs.current[i] = el)} role="menuitem" type="button" tabIndex={-1} aria-disabled={it.disabled || undefined} className="bv-menu__item"
                onClick={() => { if (it.disabled) return; it.onSelect?.(); close(); }}>{it.label}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
