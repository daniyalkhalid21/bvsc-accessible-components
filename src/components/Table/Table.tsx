import React, { useId, useMemo, useState } from 'react';
import './Table.css';
export interface Column<T> { key: keyof T & string; header: string; sortable?: boolean; numeric?: boolean; render?: (row: T) => React.ReactNode; }
export interface TableProps<T> { caption: string; columns: Column<T>[]; rows: T[]; rowKey: (row: T) => string; /** Accessible name of the scroll region. Defaults to the caption. */ scrollLabel?: string; }
type Dir = 'ascending' | 'descending';
export function Table<T extends Record<string, any>>({ caption, columns, rows, rowKey, scrollLabel }: TableProps<T>) {
  const id = useId(); const [sort, setSort] = useState<{ key: string; dir: Dir } | null>(null); const [msg, setMsg] = useState('');
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find(c => c.key === sort.key)!;
    return [...rows].sort((a, b) => {
      const x = a[sort.key], y = b[sort.key]; const c = col.numeric ? x - y : String(x).localeCompare(String(y));
      return sort.dir === 'ascending' ? c : -c;
    });
  }, [rows, sort, columns]);
  const onSort = (c: Column<T>) => {
    const dir: Dir = sort?.key === c.key && sort.dir === 'ascending' ? 'descending' : 'ascending';
    setSort({ key: c.key, dir }); setMsg(`Sorted by ${c.header}, ${dir}`);
  };
  return (
    <div>
      <div role="region" aria-label={scrollLabel ?? caption} tabIndex={0} className="bv-table-wrap">
        <table className="bv-table">
          <caption id={`${id}-cap`}>{caption}</caption>
          <thead><tr>
            {columns.map(c => {
              const active = sort?.key === c.key;
              return (
                <th key={c.key} scope="col" className={c.numeric ? 'is-num' : undefined} aria-sort={c.sortable ? (active ? sort!.dir : 'none') : undefined}>
                  {c.sortable ? (
                    <button type="button" className="bv-table__sort" onClick={() => onSort(c)}>
                      {c.header}
                      <svg aria-hidden="true" focusable="false" width="12" height="14" viewBox="0 0 12 14"><path d="M6 1L2 5h8z" fill={active && sort!.dir === 'ascending' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5"/><path d="M6 13L2 9h8z" fill={active && sort!.dir === 'descending' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5"/></svg>
                    </button>
                  ) : c.header}
                </th>
              );
            })}
          </tr></thead>
          <tbody>
            {sorted.map(r => (
              <tr key={rowKey(r)}>
                {columns.map((c, i) => i === 0
                  ? <th key={c.key} scope="row">{c.render ? c.render(r) : String(r[c.key])}</th>
                  : <td key={c.key} className={c.numeric ? 'is-num' : undefined}>{c.render ? c.render(r) : String(r[c.key])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div role="status" className="visually-hidden">{msg}</div>
    </div>
  );
}
