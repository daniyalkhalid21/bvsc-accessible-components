import React, { useId } from 'react';
import './FormField.css';

interface BaseProps { label: string; hint?: string; error?: string; required?: boolean; }

function describedBy(id: string, hint?: string, error?: string) {
  return [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;
}
function Hint({ id, text }: { id: string; text?: string }) { return text ? <p id={`${id}-hint`} className="bv-field__hint">{text}</p> : null; }
function ErrorMsg({ id, text }: { id: string; text?: string }) {
  return text ? (
    <p id={`${id}-error`} className="bv-field__error">
      <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M8 4v5M8 11v1.5" stroke="currentColor" strokeWidth="2"/></svg>
      <span><span className="visually-hidden">Error:</span>{" "}{text}</span>
    </p>
  ) : null;
}
function LabelText({ label, required }: { label: string; required?: boolean }) {
  return <>{label}{required && <span className="bv-field__req"> (required)</span>}</>;
}

export type TextInputProps = BaseProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> & { id?: string };
export function TextInput({ label, hint, error, required, id, className = '', ...rest }: TextInputProps) {
  const gen = useId(); const fid = id ?? gen;
  return (
    <div className="bv-field">
      <label htmlFor={fid} className="bv-field__label"><LabelText label={label} required={required} /></label>
      <Hint id={fid} text={hint} />
      <input id={fid} className={`bv-control ${className}`} required={required} aria-required={required || undefined} aria-invalid={error ? true : undefined} aria-describedby={describedBy(fid, hint, error)} {...rest} />
      <ErrorMsg id={fid} text={error} />
    </div>
  );
}

export type TextareaProps = BaseProps & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & { id?: string };
export function Textarea({ label, hint, error, required, id, className = '', ...rest }: TextareaProps) {
  const gen = useId(); const fid = id ?? gen;
  return (
    <div className="bv-field">
      <label htmlFor={fid} className="bv-field__label"><LabelText label={label} required={required} /></label>
      <Hint id={fid} text={hint} />
      <textarea id={fid} rows={4} className={`bv-control ${className}`} required={required} aria-required={required || undefined} aria-invalid={error ? true : undefined} aria-describedby={describedBy(fid, hint, error)} {...rest} />
      <ErrorMsg id={fid} text={error} />
    </div>
  );
}

export type SelectProps = BaseProps & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'id'> & { id?: string; options: { value: string; label: string }[]; placeholder?: string };
export function Select({ label, hint, error, required, id, options, placeholder, className = '', ...rest }: SelectProps) {
  const gen = useId(); const fid = id ?? gen;
  return (
    <div className="bv-field">
      <label htmlFor={fid} className="bv-field__label"><LabelText label={label} required={required} /></label>
      <Hint id={fid} text={hint} />
      <select id={fid} className={`bv-control ${className}`} required={required} aria-required={required || undefined} aria-invalid={error ? true : undefined} aria-describedby={describedBy(fid, hint, error)} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ErrorMsg id={fid} text={error} />
    </div>
  );
}

export type CheckboxProps = { label: string; hint?: string; error?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> & { id?: string };
export function Checkbox({ label, hint, error, id, className = '', ...rest }: CheckboxProps) {
  const gen = useId(); const fid = id ?? gen;
  return (
    <div className="bv-field">
      <div className="bv-check">
        <input id={fid} type="checkbox" className="bv-check__input" aria-invalid={error ? true : undefined} aria-describedby={describedBy(fid, hint, error)} {...rest} />
        <label htmlFor={fid} className="bv-check__label">{label}</label>
      </div>
      <Hint id={fid} text={hint} />
      <ErrorMsg id={fid} text={error} />
    </div>
  );
}

export interface RadioGroupProps extends BaseProps {
  name: string; options: { value: string; label: string; hint?: string }[];
  value?: string; onChange?: (value: string) => void;
}
export function RadioGroup({ legend, name, hint, error, required, options, value, onChange }: Omit<RadioGroupProps, 'label'> & { legend: string }) {
  const fid = useId();
  return (
    <fieldset className="bv-fieldset" aria-describedby={describedBy(fid, hint, error)}>
      <legend className="bv-field__label"><LabelText label={legend} required={required} /></legend>
      <Hint id={fid} text={hint} />
      {options.map(o => (
        <div className="bv-check" key={o.value}>
          <input type="radio" id={`${fid}-${o.value}`} name={name} value={o.value} className="bv-check__input" checked={value === undefined ? undefined : value === o.value} onChange={() => onChange?.(o.value)} />
          <label htmlFor={`${fid}-${o.value}`} className="bv-check__label">{o.label}</label>
        </div>
      ))}
      <ErrorMsg id={fid} text={error} />
    </fieldset>
  );
}
