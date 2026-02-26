import { Separator } from "@/components/atomic/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atomic/tabs"
import Account from "./account/account"
import PlanBilling from "./plan/planBilling"
import Team from "./team/team"

const SettingsView = () => {
  return (
    <div className="p-4">
            <h1 className="mb-4 text-xl font-normal">Settings</h1>
            <Tabs defaultValue="account" className="w-full md:gap-6" >
                <TabsList variant={"ghost"}>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="plan">Plan &  Billings</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>
                <Separator />
                <TabsContent value="account">
                    <Account/>
                </TabsContent>
                <TabsContent value="plan">
                    <PlanBilling/>
                </TabsContent>
                <TabsContent value="team">
                    <Team/>
                </TabsContent>
            </Tabs>
        </div>
  )
}

export default SettingsView