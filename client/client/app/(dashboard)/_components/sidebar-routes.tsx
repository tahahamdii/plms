"use client"

import { Compass, GroupIcon, Layout } from "lucide-react"
import { SideBarItem } from "./sidebaritem";

const guestRoutes = [ 
    {
        icon: Layout,
        label : "Acceuil",
        href : '/'
    },
    {
        icon: Compass,
        label : "Rechercher",
        href : '/search'
    },
    {
        icon: GroupIcon,
        label : "Community",
        href : '/community'
    }
]

export const SideBarRoutes = () => {
    const routes = guestRoutes ; 

    return(
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SideBarItem
                key ={route.href}
                icon ={route.icon}
                label = {route.label}
                href = {route.href}
                />
            ))}
        </div>
    )
}