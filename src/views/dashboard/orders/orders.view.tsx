import { Button } from "@/components/atomic/button"
import { Separator } from "@/components/atomic/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atomic/tabs"
import { Plus } from "lucide-react"
import OrderList from "./orderList"

const OrdersView = () => {
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
                        <OrderList />
                        <OrderList />
                        <OrderList />
                    </div>
                </TabsContent>
                <TabsContent value="renewals">
                    <div className="space-y-6">
                        <OrderList />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default OrdersView