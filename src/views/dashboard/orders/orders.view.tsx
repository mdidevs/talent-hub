import { Button } from "@/components/atomic/button"
import { Separator } from "@/components/atomic/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atomic/tabs"
import { Plus } from "lucide-react"
import OrderList from "./orderList"
import { useEffect, useMemo, useState } from "react"
import { orderService, type ListOrdersParams, type OrderDto } from "@/services/order/order.service"
import { useSearchParams } from "react-router-dom"

const OrdersView = () => {
    const [searchParams] = useSearchParams()
    const [orders, setOrders] = useState<OrderDto[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const queryParams = useMemo((): ListOrdersParams => {
        const rawPage = searchParams.get('page')
        const rawLimit = searchParams.get('limit')
        const page = rawPage !== null ? Number(rawPage) : undefined
        const limit = rawLimit !== null ? Number(rawLimit) : undefined
        const customer_id = searchParams.get('customer_id')
        const status = searchParams.get('status')

        return {
            // Don't send defaults; let API decide (avoids strict query validators)
            page: page && Number.isFinite(page) && page > 0 ? page : undefined,
            limit: limit && Number.isFinite(limit) && limit > 0 ? limit : undefined,
            customer_id: customer_id ?? undefined,
            status: status ?? undefined,
        }
    }, [searchParams])

    useEffect(() => {
        let cancelled = false
        setIsLoading(true)
        setError(null)

        orderService.listOrders(queryParams)
            .then((data) => {
                if (cancelled) return
                setOrders(Array.isArray(data) ? data : [])
            })
            .catch((e) => {
                if (cancelled) return
                setError(e instanceof Error ? e.message : 'Failed to load orders')
                setOrders([])
            })
            .finally(() => {
                if (cancelled) return
                setIsLoading(false)
            })

        return () => { cancelled = true }
    }, [queryParams])

    return (
        <div className="p-4">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-xl font-normal">Orders</h1>
                <Button><Plus /> New Order</Button>
            </div>
            <Tabs defaultValue="all" className="w-full md:gap-6" >
                <TabsList variant={"ghost"}>
                    <TabsTrigger value="all">All orders</TabsTrigger>
                    <TabsTrigger value="renewals">Renewals</TabsTrigger>
                </TabsList>
                <Separator />
                <TabsContent value="all">
                    <div className="space-y-6">
                        {isLoading ? <div className="text-sm opacity-70">Loading…</div> : null}
                        {error ? <div className="text-sm text-destructive">{error}</div> : null}
                        {!isLoading && !error && orders.length === 0 ? (
                            <div className="text-sm opacity-70">No orders found.</div>
                        ) : null}
                        {orders.map((order) => (
                            <OrderList key={order.id} order={order} />
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="renewals">
                    <div className="space-y-6">
                        <div className="text-sm opacity-70">Renewals view not wired yet.</div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default OrdersView