import { SideBar } from "./_components/sidebar";
import { Inter } from 'next/font/google'


const inter = Inter({ subsets: ['latin'] })

const DashboardLayout  =({
    children
}: {
children: React.ReactNode;
}) => {
    return (
        <div className={inter.className}>
        <div className="h-full">
            <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
            <SideBar/>
            </div>
            <main className="md:pl-56 h-full">
            {children}
            </main>
        </div>
        </div>
    )
}


export default DashboardLayout;