import { Badge } from '@/components/atomic/badge';
import { Button } from '@/components/atomic/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atomic/table';
import { orderService, type OrderDto } from '@/services/order/order.service';
import { selectUser } from '@/store/auth/auth.selector';
import type { RootState } from '@/store/store';
import { Download } from 'lucide-react';
import type { ComponentProps } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const formatMoney = (amount: number, currency?: string) => {
  const cur = currency && currency.trim().length > 0 ? currency.toUpperCase() : 'USD';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: cur }).format(amount);
  } catch {
    return `${amount} ${cur}`;
  }
};

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: '2-digit' });
};

const statusVariant = (status?: string): ComponentProps<typeof Badge>['variant'] => {
  const normalized = (status ?? '').toLowerCase();
  if (['paid', 'succeeded', 'complete', 'completed'].includes(normalized)) return 'success';
  if (['pending', 'processing', 'created'].includes(normalized)) return 'info';
  if (['failed', 'canceled', 'cancelled', 'refunded'].includes(normalized)) return 'destructive';
  return 'secondary';
};

const Invoice = () => {
  const user = useSelector((s: RootState) => selectUser(s));
  const customerId = user?.customer_id ?? null;

  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canLoad = useMemo(() => customerId !== null && customerId !== undefined, [customerId]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      if (!canLoad) return;
      setLoading(true);
      setError(null);
      try {
        const res = await orderService.listOrders({ customer_id: customerId as number | string, page: 1, limit: 20 });
        if (!alive) return;
        setOrders(res ?? []);
      } catch (e: any) {
        if (!alive) return;
        const msg = e?.response?.data?.message || e?.message || 'Failed to load invoices';
        setError(String(msg));
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [canLoad, customerId]);

  return (
    <>
    <div className='bg-background-white-0 rounded-md overflow-hidden border border-stroke-soft-200'>
                <Table>
                    <TableHeader className="bg-transparent [&_tr]:border-b-0">
                        <TableRow className='h-12'>
                            <TableHead>Due date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Invoice</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!canLoad && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-text-sub-600">
                              No customer id found for this user.
                            </TableCell>
                          </TableRow>
                        )}
                        {canLoad && loading && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-text-sub-600">
                              Loading invoices…
                            </TableCell>
                          </TableRow>
                        )}
                        {canLoad && !loading && error && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-destructive">
                              {error}
                            </TableCell>
                          </TableRow>
                        )}
                        {canLoad && !loading && !error && orders.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-text-sub-600">
                              No invoices yet.
                            </TableCell>
                          </TableRow>
                        )}
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{formatDate(order.createdAt)}</TableCell>
                                <TableCell>Order #{order.id}</TableCell>
                                <TableCell>{formatMoney(order.total_amount, order.currency)}</TableCell>
                                <TableCell>
                                    <Badge variant={"info"}>—</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={statusVariant(order.status)}>
                                      {order.status || '—'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button size={'icon'} variant={'ghost'} asChild>
                                      <Link to={`/orders/details/${order.id}`} aria-label={`Open order ${order.id}`}>
                                        <Download />
                                      </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
    </>
  )
}

export default Invoice