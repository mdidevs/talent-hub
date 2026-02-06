import { SidebarItem } from '@/components/molecule/sidebar/sidebar-items';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from '@/components/atomic/breadcrumb';
import { Separator } from '@/components/atomic/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/atomic/sidebar';
import { Outlet } from 'react-router-dom';

export const MainLayout: React.FC = () => {

  return (
    <SidebarProvider>
      <SidebarItem />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main>
          <Outlet/>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
