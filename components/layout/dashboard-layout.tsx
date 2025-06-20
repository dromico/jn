"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { browserSupabase } from "@/lib/supabase";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const {
          data: { user },
        } = await browserSupabase.auth.getUser();
        if (user?.user_metadata?.name) {
          setUserName(user.user_metadata.name);
        } else {
          setUserName(user?.email?.split("@")[0] || "User");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent event bubbling to Link
    e.stopPropagation();

    try {
      setIsSigningOut(true);

      // Call our server-side API to sign out
      await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Sign out from client as well
      await browserSupabase.auth.signOut();

      // Use Next.js router for navigation
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      name: "Tasks",
      href: "/dashboard/todos",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    },
    {
      name: "Invoices",
      href: "/dashboard/invoices",
      icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    },
    {
      name: "Webhooks",
      href: "/dashboard/webhooks",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
    },
    {
      name: "Content",
      href: "/dashboard/content",
      icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    },
  ];

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      data-oid="l.v_a2y"
    >
      {/* Mobile sidebar toggle */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center bg-white dark:bg-gray-800 border-b p-4"
        data-oid="yl.s:-f"
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-500 focus:outline-none"
          data-oid="8zur:ge"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            data-oid="ihzgpl4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
              data-oid="jp:.482"
            />
          </svg>
        </button>
        <div className="ml-4 font-semibold" data-oid="ci-.:65">
          Dashboard
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          data-oid="s0rq8dr"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-gray-800 border-r transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
        data-oid=":2psz.v"
      >
        <div
          className="flex items-center justify-center h-16 border-b"
          data-oid="pacdqs9"
        >
          <Link href="/" className="flex items-center" data-oid="bk9eev5">
            <Image
              src="/next.svg"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-full dark:invert"
              data-oid="q06xx0q"
            />

            <span className="ml-2 text-xl font-bold" data-oid="2s3be5r">
              Your Company
            </span>
          </Link>
        </div>

        <div className="p-4" data-oid="qzx032v">
          <div className="flex items-center mb-6" data-oid="ftfgrwr">
            <Link
              href="/dashboard/settings"
              className="flex items-center group"
              data-oid="69vxcdm"
            >
              <div
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 group-hover:bg-gray-300 transition-colors"
                data-oid="u21z1jj"
              >
                {userName?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-2" data-oid="hoksap:">
                <p
                  className="text-sm font-medium group-hover:text-blue-600 transition-colors"
                  data-oid="1q4y68z"
                >
                  {userName}
                </p>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-gray-500 hover:text-gray-700"
                  disabled={isSigningOut}
                  data-oid="e--9d9x"
                >
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            </Link>
          </div>

          <nav className="space-y-1" data-oid="-y_jt88">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${
                    pathname === item.href
                      ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }
                `}
                data-oid="pez.bzb"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-3 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  data-oid="ejr75i3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                    data-oid="had2it9"
                  />
                </svg>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64" data-oid="5kc8lan">
        <div
          className="py-6 px-4 sm:px-6 lg:px-8 min-h-screen pt-16 lg:pt-6"
          data-oid=".alv391"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
