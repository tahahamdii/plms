import { LucideIcon } from "lucide-react"
import { usePathname, useRouter} from "next/navigation"

interface SideBarItemProps {
    icon : LucideIcon ,
    label: string,
    href: string
}



export const SideBarItem = ({icon: Icon, label, href} : SideBarItemProps) => {

    const pathname = usePathname();
    const router = useRouter();


    return (
        <div>side bar item </div>
    )
}