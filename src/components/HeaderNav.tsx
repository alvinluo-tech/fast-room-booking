"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderNav() {
  const pathname = usePathname();
  
  // Determine if we are on an unauthenticated entry point
  const isUnauthenticatedView = pathname === '/' || pathname === '/login';
  
  return (
    <nav className="flex items-center gap-6">
      {isUnauthenticatedView ? (
        // Render nothing on the right side of the header for home/login pages
        <></>
      ) : (
        // Assume authenticated context for all other paths
        <>
          <Link 
            href="/slots" 
            className="text-sm font-semibold transition-colors hover:opacity-80" 
            style={{ color: '#D8B4FE' }}
          >
            可预约时间
          </Link>
          <Link 
            href="/bookings" 
            className="text-sm font-semibold transition-colors hover:opacity-80" 
            style={{ color: '#D8B4FE' }}
          >
            我的预约
          </Link>
        </>
      )}
    </nav>
  );
}
