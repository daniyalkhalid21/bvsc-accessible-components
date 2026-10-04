import React, { useId, useRef, useState } from 'react';
import './Accordion.css';
export interface AccordionItem { id: string; title: string; content: React.ReactNode; }
export interface AccordionProps { items: AccordionItem[]; headingLevel?: 2 | 3 | 4; allowMultiple?: boolean; defaultOpen?: string[]; }
export function Accordion({ items, headingLevel = 3, allowMultiple = true, defaultOpen = [] }: AccordionProps) {
  const base = useId(); const [open, setOpen] = useState<string[]>(defaultOpen);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const H = `h${headingLevel}` as 'h3';
  // APG: skip role=region when there are more than about six panels, to avoid landmark clutter.
  const useRegion = items.length <= 6;
  const toggle = (id: string) => setOpen(o => o.includes(id) ? o.filter(x => x !== id) : allowMultiple ? [...o, id] : [id]);
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const n = items.length; let t = -1;
    if (e.key === 'ArrowDown') t = (i + 1) % n; else if (e.key === 'ArrowUp') t = (i - 1 + n) % n;
    else if (e.key === 'Home') t = 0; else if (e.key === 'End') t = n - 1;
    if (t >= 0) { e.preventDefault(); refs.current[t]?.focus(); }
  };
  return (
    <div className="bv-acc">
      {items.map((it, i) => {
        const isOpen = open.includes(it.id); const bid = `${base}-b-${it.id}`; const pid = `${base}-p-${it.id}`;
        return (
          <div className="bv-acc__item" key={it.id}>
            <H className="bv-acc__heading">
              <button ref={el => (refs.current[i] = el)} id={bid} type="button" className="bv-acc__btn" aria-expanded={isOpen} aria-controls={pid}
                onClick={() => toggle(it.id)} onKeyDown={e => onKeyDown(e, i)}>
                <span>{it.title}</span>
                <svg aria-hidden="true" focusable="false" className="bv-acc__chev" width="16" height="16" viewBox="0 0 16 16"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
              </button>
            </H>
            <div id={pid} role={useRegion ? "region" : undefined} aria-labelledby={useRegion ? bid : undefined} hidden={!isOpen} className="bv-acc__panel">{it.content}</div>
          </div>
        );
      })}
    </div>
  );
}
