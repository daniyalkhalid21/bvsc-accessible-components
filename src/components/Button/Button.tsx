import React from 'react';
import './Button.css';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  loadingText?: string;
  /** Icon-only buttons: pass an icon as children and a label here. */
  iconOnly?: boolean;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', loading = false, loadingText = 'Loading', iconOnly = false, disabled, children, className = '', onClick, type = 'button', ...rest }, ref) {
  // While loading we keep the button focusable (aria-disabled) so focus is not lost; clicks are ignored.
  const blocked = loading || disabled;
  return (
    <button
      ref={ref} type={type}
      className={`bv-btn bv-btn--${variant} ${iconOnly ? 'bv-btn--icon' : ''} ${className}`.trim()}
      aria-busy={loading || undefined}
      aria-disabled={loading ? true : undefined}
      disabled={disabled && !loading}
      onClick={(e) => { if (blocked) { e.preventDefault(); return; } onClick?.(e); }}
      {...rest}>
      {loading && <span className="bv-btn__spinner" aria-hidden="true" />}
      <span>{children}</span>
      {loading && <span className="visually-hidden">{`, ${loadingText}`}</span>}
    </button>
  );
});
