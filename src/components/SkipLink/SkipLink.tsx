import './SkipLink.css';
export function SkipLink({ targetId = 'main', children = 'Skip to main content' }: { targetId?: string; children?: React.ReactNode }) {
  return <a className="skip-link" href={`#${targetId}`}>{children}</a>;
}
