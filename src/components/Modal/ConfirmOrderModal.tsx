import { Modal } from './Modal';
import { Button } from '../Button/Button';
export interface OrderLine { name: string; qty: number; price: number; }
export function ConfirmOrderModal({ open, onClose, onConfirm, lines, loading = false }: { open: boolean; onClose: () => void; onConfirm: () => void; lines: OrderLine[]; loading?: boolean }) {
  const total = lines.reduce((s, l) => s + l.qty * l.price, 0);
  return (
    <Modal open={open} onClose={onClose} title="Confirm your order" description={`You are about to place an order for ${lines.length} item${lines.length === 1 ? '' : 's'}. Review it before you continue.`}
      footer={<><Button variant="secondary" onClick={onClose} data-autofocus>Back to basket</Button><Button onClick={onConfirm} loading={loading} loadingText="Placing order">Place order</Button></>}>
      <ul className="bv-modal__lines">{lines.map(l => <li key={l.name}><span>{l.qty} × {l.name}</span><span>${(l.qty * l.price).toFixed(2)}</span></li>)}</ul>
      <p className="bv-modal__total"><span>Total</span><span>${total.toFixed(2)}</span></p>
    </Modal>
  );
}
