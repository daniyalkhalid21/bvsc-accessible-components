import { useRef, useState } from 'react';
import './DemoPage.css';
import { SkipLink } from './components/SkipLink/SkipLink';
import { Menu } from './components/Menu/Menu';
import { Tabs } from './components/Tabs/Tabs';
import { Table, Column } from './components/Table/Table';
import { Button } from './components/Button/Button';
import { Modal } from './components/Modal/Modal';
import { ConfirmOrderModal, type OrderLine } from './components/Modal/ConfirmOrderModal';
import { ToastProvider, useToast } from './components/Toast/Toast';
import { Accordion } from './components/Accordion/Accordion';
import { OrderEnquiryForm } from './components/FormField/FormField.stories';
import { products, Product } from './components/Table/Table.stories';

type BasketRow = Product & { qty: number };
type Order = { id: string; invoice: string; date: string; lines: OrderLine[]; items: Record<string, number>; count: number; total: number; status: string };
const money = (n: number) => `$${n.toFixed(2)}`;
const USER = 'Dr. Sam Lee';

function Catalog() {
  const { show } = useToast();
  const [tab, setTab] = useState('products');
  const [basket, setBasket] = useState<Record<string, number>>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [signedIn, setSignedIn] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [invoice, setInvoice] = useState<Order | null>(null);
  const [announce, setAnnounce] = useState('');
  const basketHeading = useRef<HTMLHeadingElement>(null);
  const ordersHeading = useRef<HTMLHeadingElement>(null);
  const focusSoon = (r: React.RefObject<HTMLElement>) => setTimeout(() => r.current?.focus(), 50);

  const rows: BasketRow[] = products.filter(p => basket[p.sku]).map(p => ({ ...p, qty: basket[p.sku] }));
  const count = rows.reduce((n, r) => n + r.qty, 0);
  const total = rows.reduce((n, r) => n + r.qty * r.price, 0);
  const lines: OrderLine[] = rows.map(r => ({ name: `${r.name} (${r.size})`, qty: r.qty, price: r.price }));

  const add = (p: Product) => {
    if ((basket[p.sku] ?? 0) >= p.stock) { show('error', `Only ${p.stock} of ${p.name} (${p.size}) in stock. Your basket already has them all.`); return; }
    setBasket(b => ({ ...b, [p.sku]: (b[p.sku] ?? 0) + 1 })); show('success', `Added to basket: ${p.name}, ${p.size}`);
  };
  const setQty = (r: BasketRow, q: number) => {
    if (q < 1) { setAnnounce(`Minimum quantity is 1. Use Remove to take ${r.name} out.`); return; }
    if (q > r.stock) { setAnnounce(`Only ${r.stock} in stock.`); return; }
    setBasket(b => ({ ...b, [r.sku]: q })); setAnnounce(`Quantity of ${r.name}, ${r.size} is now ${q}`);
  };
  const remove = (r: BasketRow) => { setBasket(b => { const n = { ...b }; delete n[r.sku]; return n; }); setAnnounce(`Removed ${r.name}, ${r.size}, from basket`); focusSoon(basketHeading); };
  const clear = () => { setBasket({}); show('info', 'Basket cleared.'); focusSoon(basketHeading); };
  const goBasket = () => { setTab('basket'); focusSoon(basketHeading); };

  const place = () => {
    if (!signedIn) { setConfirmOpen(false); show('error', 'Please sign in to place your order.'); return; }
    setBusy(true);
    setTimeout(() => {
      const n = 1001 + orders.length;
      setOrders(o => [{ id: `BV-${n}`, invoice: `INV-${n}`, date: new Date().toLocaleDateString('en-GB'), lines, items: basket, count, total, status: 'Processing' }, ...o]);
      setBasket({}); setBusy(false); setConfirmOpen(false); setTab('orders');
      show('success', `Order BV-${n} placed. A receipt is on its way to your email.`); focusSoon(ordersHeading);
    }, 800);
  };
  const signIn = () => { setSignedIn(true); show('success', `Signed in as ${USER} (demo account).`); };
  const signOut = () => { setSignedIn(false); show('info', 'You have been signed out.'); };
  const reorder = () => {
    if (!orders.length) { show('error', 'You have no earlier orders to reorder.'); return; }
    setBasket(orders[0].items); show('success', `Basket refilled from order ${orders[0].id}.`); goBasket();
  };
  const latestInvoice = () => { if (!orders.length) { show('info', 'You have no invoices yet. An invoice is created when you place an order.'); return; } setInvoice(orders[0]); };

  const productCols: Column<Product>[] = [
    { key: 'name', header: 'Product', sortable: true },
    { key: 'category', header: 'Category', sortable: true, render: r => <span className="demo-chip">{r.category}</span> },
    { key: 'size', header: 'Size' },
    { key: 'price', header: 'Price', sortable: true, numeric: true, render: r => <span className="demo-price">{money(r.price)}</span> },
    { key: 'stock', header: 'In stock', numeric: true, render: r => r.stock === 0 ? <span className="bv-stock">Out of stock</span> : String(r.stock) },
    { key: 'sku', header: 'Basket', render: r => <Button variant="secondary" disabled={r.stock === 0} aria-label={`Add ${r.name}, ${r.size}, to basket`} onClick={() => add(r)}>Add</Button> },
  ];
  const basketCols: Column<BasketRow>[] = [
    { key: 'name', header: 'Product', render: r => `${r.name} (${r.size})` },
    { key: 'qty', header: 'Quantity', render: r => (
      <span className="demo-qty" role="group" aria-label={`Quantity of ${r.name}, ${r.size}`}>
        <Button variant="secondary" iconOnly aria-label={`Decrease quantity of ${r.name}, ${r.size}`} onClick={() => setQty(r, r.qty - 1)}>−</Button>
        <span className="demo-qty__n">{r.qty}</span>
        <Button variant="secondary" iconOnly aria-label={`Increase quantity of ${r.name}, ${r.size}`} onClick={() => setQty(r, r.qty + 1)}>+</Button>
      </span>) },
    { key: 'price', header: 'Line total', numeric: true, render: r => <span className="demo-price">{money(r.qty * r.price)}</span> },
    { key: 'sku', header: 'Remove', render: r => <Button variant="secondary" aria-label={`Remove ${r.name}, ${r.size}, from basket`} onClick={() => remove(r)}>Remove</Button> },
  ];
  const orderCols: Column<Order>[] = [
    { key: 'id', header: 'Order' }, { key: 'date', header: 'Date' },
    { key: 'count', header: 'Items', numeric: true },
    { key: 'total', header: 'Total', numeric: true, render: o => <span className="demo-price">{money(o.total)}</span> },
    { key: 'status', header: 'Status', render: o => <span className="demo-chip">{o.status}</span> },
    { key: 'invoice', header: 'Invoice', render: o => <Button variant="secondary" aria-label={`View invoice ${o.invoice} for order ${o.id}`} onClick={() => setInvoice(o)}>View invoice</Button> },
  ];

  const menuItems = signedIn ? [
    { id: 'orders', label: 'My orders', onSelect: () => { setTab('orders'); focusSoon(ordersHeading); } },
    { id: 'reorder', label: 'Reorder last order', onSelect: reorder },
    { id: 'invoice', label: 'Latest invoice', onSelect: latestInvoice },
    { id: 'out', label: 'Sign out', onSelect: signOut },
  ] : [{ id: 'in', label: 'Sign in', onSelect: signIn }];

  const empty = (text: string, label: string, onClick: () => void) => <div className="demo-empty"><p>{text}</p><Button onClick={onClick}>{label}</Button></div>;

  return (
    <>
            <header className="demo-header">
        <SkipLink targetId="main" />
        <p className="demo-brand">Boutique Veterinary Supply Company</p>
        <div className="demo-header__right">
          <span className="demo-user">{signedIn ? USER : 'Not signed in'}</span>
          <Button variant="secondary" onClick={goBasket}>Basket ({count})</Button>
          <nav aria-label="Account"><Menu label="Account" items={menuItems} /></nav>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="demo-main">
        <section className="demo-hero">
          <div className="demo-wrap">
            <h1>Supplies for the animals in your care</h1>
            <p>Syringes, feed supplements, grooming tools and pet health essentials, delivered to clinics, farms and homes.</p>
          </div>
          <div className="demo-ruler" aria-hidden="true" />
        </section>
        <div className="demo-wrap demo-body">
          <Tabs label="Catalogue sections" value={tab} onChange={setTab} tabs={[
            { id: 'products', label: 'Products', content: (<>
              <Table caption="Price list: veterinary supplies" columns={productCols} rows={products} rowKey={r => r.sku} />
              <p className="demo-basket"><span>Basket: {count} item{count === 1 ? '' : 's'}</span> <Button onClick={goBasket}>View basket</Button></p></>) },
            { id: 'basket', label: `Basket (${count})`, content: (<>
              <h2 ref={basketHeading} tabIndex={-1} className="demo-h2">Your basket</h2>
              {rows.length === 0 ? empty('Your basket is empty.', 'Browse products', () => setTab('products')) : (<>
                <Table caption="Items in your basket" columns={basketCols} rows={rows} rowKey={r => r.sku} />
                <p className="demo-total"><span>Total</span><span>{money(total)}</span></p>
                <div className="demo-actions"><Button variant="secondary" onClick={clear}>Clear basket</Button><Button onClick={() => setConfirmOpen(true)}>Place order</Button></div></>)}
              <div role="status" className="visually-hidden">{announce}</div></>) },
            { id: 'orders', label: 'My orders', content: (<>
              <h2 ref={ordersHeading} tabIndex={-1} className="demo-h2">Your orders</h2>
              {!signedIn ? empty('Sign in to see your orders.', 'Sign in', signIn)
                : orders.length === 0 ? empty('You have no orders yet. Orders you place appear here.', 'Browse products', () => setTab('products'))
                : <Table caption="Order history" columns={orderCols} rows={orders} rowKey={o => o.id} />}</>) },
            { id: 'delivery', label: 'Delivery and returns', content: (<><h2 className="demo-h2">Delivery and returns</h2><Accordion headingLevel={3} items={[{ id: 'd', title: 'How fast is delivery?', content: <p>Standard delivery takes 3 to 5 working days. Cold-chain items ship next day.</p> }, { id: 'r', title: 'Can I return opened products?', content: <p>Sealed products can be returned within 30 days. Opened syringes and medicines cannot.</p> }]} /></>) },
            { id: 'enquiry', label: 'Order enquiry', content: <OrderEnquiryForm onValid={() => show('success', 'Enquiry sent.')} /> },
          ]} />
        </div>
      </main>
      <ConfirmOrderModal open={confirmOpen} onClose={() => setConfirmOpen(false)} lines={lines} loading={busy} onConfirm={place} />
      <Modal open={!!invoice} onClose={() => setInvoice(null)} title={invoice ? `Invoice ${invoice.invoice}` : 'Invoice'} description={invoice ? `Order ${invoice.id}, placed ${invoice.date}` : undefined}
        footer={<Button onClick={() => setInvoice(null)} data-autofocus>Close</Button>}>
        {invoice && (<><ul className="bv-modal__lines">{invoice.lines.map(l => <li key={l.name}><span>{l.qty} × {l.name}</span><span>{money(l.qty * l.price)}</span></li>)}</ul><p className="bv-modal__total"><span>Total</span><span>{money(invoice.total)}</span></p></>)}
      </Modal>
    </>
  );
}
export function DemoPage() { return <ToastProvider><Catalog /></ToastProvider>; }
