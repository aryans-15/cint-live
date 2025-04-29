"use client"

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify'
import { useEffect } from 'react'

export default function Notifier() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const error = searchParams.get('error');
    useEffect(() => {
        if (error === 'noauthchall') {
            toast.error("You must be logged in to compete!");
        } else if (error === 'noauthteam') {
            toast.error("You must be logged in to view team information!");
        } else if (error === 'noauth') {
            toast.error("You must be logged in to view this page!");
        }
        if (error) {
            router.replace(pathname, false);
        }
    }, [error]);
    return (
        <ToastContainer />
    )
}