import { LucideIcon } from "lucide-react"
import { usePathname, useRouter} from "next/navigation"
import {cn} from '../../../libs/utils'


interface SideBarItemProps {
    icon : LucideIcon ,
    label: string,
    href: string
}



export const SideBarItem = ({icon: Icon, label, href} : SideBarItemProps) => {

    const pathname = usePathname();
    const router = useRouter();
    const isActive = 
        (pathname == "/" && href == "/") || 
        pathname == href || 
        pathname?.startsWith(`${href}/`);

    const onClick = () => {
        router.push(href);
    }


    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                    "flex items-center gap-x-2 text-slate-500 test-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20", isActive && "text-green-700 bg-sky-200/20 hover:bg-sky-200/20 "
            )}
        >

        </button>
    )
}