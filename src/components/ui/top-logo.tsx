"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TopLogo = () => {
    const pathname = usePathname() ?? "/";

    if (pathname === '/') return null;

    return (
        <Link href="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50 hidden sm:block">
            <img
                src="/triovate.png"
                alt="Triovate Labs"
                className="h-20 sm:h-28 md:h-32 w-auto object-contain"
                style={{ filter: 'drop-shadow(0 1px 6px rgba(0,0,0,0.3))' }}
            />
        </Link>
    );
};

export default TopLogo;
