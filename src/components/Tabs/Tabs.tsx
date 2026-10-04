import React, { useId, useRef, useState } from 'react';
import './Tabs.css';
export interface TabItem { id: string; label: string; content: React.ReactNode; }
/** Automatic activation: moving focus with arrow keys selects the tab (panels are static). */
export function Tabs({ tabs, label, defaultTab, value, onChange }: { tabs: TabItem[]; label: string; defaultTab?: string; /** Controlled mode: selected tab id. */ value?: string; onChange?: (id: string) => void }) {
  const base = useId(); const [inner, setInner] = useState(defaultTab ?? tabs[0].id);
  const active = value ?? inner; const setActive = (id: string) => { setInner(id); onChange?.(id); };
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (i: number) => { setActive(tabs[i].id); refs.current[i]?.focus(); };
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const n = tabs.length; let t = -1;
    if (e.key === 'ArrowRight') t = (i + 1) % n; else if (e.key === 'ArrowLeft') t = (i - 1 + n) % n;
    else if (e.key === 'Home') t = 0; else if (e.key === 'End') t = n - 1;
    if (t >= 0) { e.preventDefault(); move(t); }
  };
  return (
    <div className="bv-tabs">
      <div role="tablist" aria-label={label} className="bv-tabs__list">
        {tabs.map((t, i) => (
          <button key={t.id} ref={el => (refs.current[i] = el)} role="tab" type="button" id={`${base}-t-${t.id}`} aria-selected={active === t.id} aria-controls={`${base}-p-${t.id}`}
            tabIndex={active === t.id ? 0 : -1} className="bv-tabs__tab" onClick={() => setActive(t.id)} onKeyDown={e => onKeyDown(e, i)}>{t.label}</button>
        ))}
      </div>
      {tabs.map(t => (
        <div key={t.id} role="tabpanel" id={`${base}-p-${t.id}`} aria-labelledby={`${base}-t-${t.id}`} hidden={active !== t.id} tabIndex={0} className="bv-tabs__panel">{t.content}</div>
      ))}
    </div>
  );
}
