import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/atomic/sidebar'
import { Calendar, LayoutPanelLeft, Settings, type LucideIcon } from 'lucide-react'
import { useLocation } from 'react-router-dom';

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
        title: 'Settings',
        icon: Settings,
        url: '/settings'
    },
    
]
const NavItem = () => {
  const location  = useLocation();
  const currentPath = location.pathname;

  return (
    <SidebarGroup className='space-y-1'>
        {Items.map((item, idx) => {
            return(
                <SidebarMenu key={idx}>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={currentPath === item.url}>
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