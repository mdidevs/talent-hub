import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "../../atomic/sidebar";
import NavItem from "./nav-item";
import { Logo } from "@/components/atomic/logo";
import { NavUser } from "./nav-user";

 
export function SidebarItem() {
  return (
    <Sidebar collapsible="icon" className="border-stroke-soft-200">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <Logo/>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
          <NavItem/>
      </SidebarContent>

      <SidebarFooter >
          <NavUser user={{
            name: "Leonard Krasner",
            email: "leonardkrasner@gmail.com",
            avatar: "L"
          }}/>
      </SidebarFooter>
    </Sidebar>
  )
}