import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/atomic/sidebar'
import { Bell, Calendar, LayoutPanelLeft, Settings, type LucideIcon } from 'lucide-react'

interface Item {
    title: string,
    icon: LucideIcon,
    url?: string,
}
const Items: Item[] = [
    {
        title: 'Overview',
        icon: LayoutPanelLeft,
        url: '/overview'
    },
    {
        title: 'Orders',
        icon: Calendar,
        url: '/orders'
    },
    {
        title: 'notification',
        icon: Bell,
    },
    {
        title: 'Settings',
        icon: Settings,
        url: '/settings'
    },
    
]
const NavItem = () => {
  return (
    <SidebarGroup className='space-y-1'>
        {Items.map((item, idx) => {
            return(
                <SidebarMenu key={idx}>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href={item.url}>
                                {<item.icon/>}
                                <span>{item.title}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            )
        })}
    </SidebarGroup>
  )
}

export default NavItem