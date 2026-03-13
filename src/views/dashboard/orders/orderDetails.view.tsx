import { Badge } from "@/components/atomic/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/atomic/table'
import File from "./files"
import { Separator } from "@/components/atomic/separator"
import RenewModal from "./renewModal"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { orderService, type OrderDto, type OrderItemDto } from "@/services/order/order.service"
import { documentService, type DocumentDto } from "@/services/document/document.service"


const sumQty = (items: OrderItemDto[] | undefined) =>
  (items ?? []).reduce((sum, it) => sum + Number(it.quantity ?? 0), 0)

const getStatusVariant = (status?: string) => {
  const s = (status ?? '').toLowerCase()
  if (['active', 'paid', 'completed', 'success', 'succeeded'].includes(s)) return 'success'
  if (['failed', 'cancelled', 'canceled', 'refunded'].includes(s)) return 'destructive'
  return 'secondary'
}

const getCustomerCompanyName = (order: OrderDto | null) => {
    const customer = order?.customer as unknown as { companies?: Array<{ company?: { name?: string } }> } | undefined
    return customer?.companies?.[0]?.company?.name
}

const getCompanyIdForDocuments = (order: OrderDto | null) => {
    const anyOrder = order as unknown as {
        cubical_usages?: Array<{ company_id?: number | null }>
        customer?: { companies?: Array<{ company_id?: number | null; company?: { id?: number | null } }> }
    } | null

    const fromUsage = anyOrder?.cubical_usages?.[0]?.company_id
    if (fromUsage) return fromUsage

    const fromCustomerLink = anyOrder?.customer?.companies?.[0]?.company_id
    if (fromCustomerLink) return fromCustomerLink

    const fromCustomerCompany = anyOrder?.customer?.companies?.[0]?.company?.id
    if (fromCustomerCompany) return fromCustomerCompany

    return undefined
}

const OrderDetailsView = () => {
    const { id } = useParams()
    const [order, setOrder] = useState<OrderDto | null>(null)
    const [docs, setDocs] = useState<DocumentDto[]>([])
    const [isLoadingOrder, setIsLoadingOrder] = useState(false)
    const [orderError, setOrderError] = useState<string | null>(null)
    const [docsError, setDocsError] = useState<string | null>(null)
    const [downloadingId, setDownloadingId] = useState<number | null>(null)

    const professionals = useMemo(() => sumQty(order?.order_items), [order?.order_items])
    const orderCode = order ? `#BK-${order.id}` : '#BK-—'

    useEffect(() => {
        if (!id) return
        let cancelled = false
        setIsLoadingOrder(true)
        setOrderError(null)

        orderService.getOrderById(id)
            .then((data) => {
                if (cancelled) return
                setOrder(data)
            })
            .catch((e) => {
                if (cancelled) return
                setOrder(null)
                setOrderError(e instanceof Error ? e.message : 'Failed to load order')
            })
            .finally(() => {
                if (cancelled) return
                setIsLoadingOrder(false)
            })

        return () => { cancelled = true }
    }, [id])

    useEffect(() => {
        const customerId = order?.customer?.id ?? order?.customer_id
        const companyId = getCompanyIdForDocuments(order)

        if (!customerId || !companyId) {
            setDocs([])
            return
        }

        let cancelled = false
        setDocsError(null)
        // Backend requires customer_id + company_id + explicit pagination.
        documentService.listDocuments({ customer_id: customerId, company_id: companyId, page: 1, limit: 20 })
            .then((data) => {
                if (cancelled) return
                setDocs(Array.isArray(data) ? data : [])
            })
            .catch((e) => {
                if (cancelled) return
                setDocs([])
                setDocsError(e instanceof Error ? e.message : 'Failed to load documents')
            })

        return () => { cancelled = true }
    }, [order?.customer?.id, order?.customer_id, order])

    const handleDownload = async (doc: DocumentDto) => {
        try {
            setDownloadingId(doc.id)
            const blob = await documentService.downloadDocument(doc.id)
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = (doc.filename || doc.name || `document-${doc.id}`).toString()
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
        } finally {
            setDownloadingId(null)
        }
    }

    return (
        <div className="p-4">
            <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-normal">{orderCode}</h1>
                    <p>{professionals} Professionals</p>
                </div>
                <RenewModal/>
            </div>
            
            <div className='bg-background-white-0 rounded-md overflow-hidden border border-stroke-soft-200'>
                {isLoadingOrder ? (
                    <div className="p-4 text-sm opacity-70">Loading…</div>
                ) : null}
                {orderError ? (
                    <div className="p-4 text-sm text-destructive">{orderError}</div>
                ) : null}
                <Table>
                    <TableHeader className="bg-transparent [&_tr]:border-b-0">
                        <TableRow className='h-12'>
                            <TableHead>Service</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Shift</TableHead>
                            <TableHead>Workspace</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(order?.order_items ?? []).map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.market_item_plan?.marketItem?.name ?? `Plan #${item.market_item_plan_id}`}</TableCell>
                                <TableCell>{item.market_item_plan?.pricePlan?.label ?? item.market_item_plan?.pricePlan?.name ?? '—'}</TableCell>
                                <TableCell>{item.market_item_plan?.pricePlan?.billing_cycle ?? '—'}</TableCell>
                                <TableCell className="text-info-base">{getCustomerCompanyName(order) ?? '—'}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(order?.status)}>
                                        {order?.status ?? '—'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="my-8 flex flex-col lg:flex-row gap-6 w-full">
                <div className="lg:w-4/12 space-y-3">
                    <h5 className="text-text-sub-600 font-normal">Documents</h5>
                    <div className="flex flex-wrap gap-2">
                        {docsError ? <div className="text-sm text-destructive">{docsError}</div> : null}
                        {docs.length === 0 && !docsError ? (
                            <div className="text-sm opacity-70">No documents found.</div>
                        ) : null}
                        {docs.map((doc) => (
                            <File
                                key={doc.id}
                                doc={doc}
                                onDownload={handleDownload}
                                isDownloading={downloadingId === doc.id}
                            />
                        ))}
                    </div>
                </div>

                <div className="lg:w-4/12 space-y-3">
                    <h5 className="text-text-sub-600 font-normal">Monthly Cost Breakdown</h5>
                    <div className="p-4 space-y-4 bg-background-white-0 rounded-md border border-stroke-soft-200">
                        <div className="flex items-center justify-between w-full">
                            <p>Professionals ({professionals}x) </p>
                            <h5 className="text-right font-medium">
                                {order?.currency} {Number(order?.total_amount ?? 0).toFixed(2)}
                            </h5>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <p>Tax </p>
                            <h5 className="text-right font-medium">0.00</h5>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <p>Shared facility fee </p>
                            <h5 className="text-right font-medium">0.00</h5>
                        </div>
                        <Separator/>
                        <div className="flex items-center justify-between w-full">
                            <h5 className="text-sm fontm">Total Monthly Recurring</h5>
                            <h5 className="text-right font-medium">
                                {order?.currency} {Number(order?.total_amount ?? 0).toFixed(2)}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>            
        </div>
    )
}

export default OrderDetailsView