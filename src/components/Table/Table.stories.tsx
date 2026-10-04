import type { Meta, StoryObj } from '@storybook/react';
import { Table, Column } from './Table';
export interface Product { sku: string; name: string; category: string; size: string; price: number; stock: number; }
export const products: Product[] = [
  { sku: 'SY-005', name: 'Luer-lock syringe, sterile', category: 'Syringes', size: '5 ml, box of 100', price: 18.5, stock: 240 },
  { sku: 'SY-020', name: 'Luer-lock syringe, sterile', category: 'Syringes', size: '20 ml, box of 50', price: 24.9, stock: 112 },
  { sku: 'ND-18G', name: 'Hypodermic needles 18G', category: 'Syringes', size: '1.5 in, box of 100', price: 9.75, stock: 0 },
  { sku: 'FD-ELEC', name: 'Electrolyte feed supplement', category: 'Feed supplements', size: '5 kg bag', price: 32.0, stock: 58 },
  { sku: 'FD-CALF', name: 'Calf milk replacer', category: 'Feed supplements', size: '20 kg sack', price: 76.4, stock: 14 },
  { sku: 'GR-SLK', name: 'Slicker brush, large', category: 'Grooming', size: 'One size', price: 12.99, stock: 77 },
  { sku: 'GR-CLP', name: 'Professional clippers', category: 'Grooming', size: 'Cordless, 2 blades', price: 149.0, stock: 6 },
  { sku: 'PH-WRM', name: 'Broad-spectrum wormer paste', category: 'Pet health', size: '30 g tube', price: 14.2, stock: 190 },
  { sku: 'PH-EAR', name: 'Ear cleaning solution', category: 'Pet health', size: '125 ml', price: 8.4, stock: 3 },
];
const fmt = (n: number) => `$${n.toFixed(2)}`;
export const columns: Column<Product>[] = [
  { key: 'name', header: 'Product', sortable: true },
  { key: 'category', header: 'Category', sortable: true },
  { key: 'size', header: 'Size' },
  { key: 'price', header: 'Price', sortable: true, numeric: true, render: r => fmt(r.price) },
  { key: 'stock', header: 'In stock', sortable: true, numeric: true, render: r => r.stock === 0 ? <span className="bv-stock">Out of stock</span> : r.stock < 10 ? <span className="bv-stock">{r.stock} (low)</span> : String(r.stock) },
];
const meta: Meta<typeof Table<Product>> = { title: 'Components/Table', component: Table as any, excludeStories: /^(products|columns)$/, args: { caption: 'Price list: veterinary supplies', columns, rows: products, rowKey: (r: Product) => r.sku } };
export default meta;
type S = StoryObj<typeof Table<Product>>;
export const PriceList: S = {};
export const NarrowViewport: S = { decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>] };
