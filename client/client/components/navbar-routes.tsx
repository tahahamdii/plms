"use client"

import { LogOut, UserIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "./ui/button";
import Link from "next/link";

export const NavbarRoutes = () => {

    const pathname = usePathname();
    const router = useRouter();

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isPlayerPage = pathname?.includes("/chapter")
    return (
        <div className="flex gap-x-2 ml-auto"
        >
            {isTeacherPage || isPlayerPage ? (
                <Link href="/">
                <Button size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Exit
                </Button>
                </Link>
            ): (
                <Link href="/teacher/courses">
                    <Button size="sm">
                        Teacher Mode
                    </Button>
                </Link>
            )}
            <button>
                <UserIcon/>
            </button>
        </div>
    )
}