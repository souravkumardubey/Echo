'use client'

import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";
import { usePathname } from "next/navigation"
import { Button } from "./ui/button";

const Header = () => {
    const pathName = usePathname();
    const isDashboard = pathName.startsWith('/dashboard');
    return (
        <header className="flex items-center justify-between px-4 h-16 sm:px-6">
            <Link href="/dashboard" className="font-medium uppercase tracking-widest" > Echo </Link>
            <div className="flex items-center gap-2">
                <Authenticated>
                    {!isDashboard && <Link href="/dashboard">
                        <Button variant='outline'> Dashboard </Button>
                    </Link>}
                    <UserButton/>
                </Authenticated>
                <Unauthenticated>
                    <SignInButton 
                    mode="modal"
                    forceRedirectUrl='/dashboard'
                    signUpForceRedirectUrl='/dashboard'
                    >
                        <Button variant='outline'> Sign In </Button>
                    </SignInButton>
                </Unauthenticated>
            </div>
        </header>
    )
}

export default Header