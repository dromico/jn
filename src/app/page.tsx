import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 z-10 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={80}
            height={20}
            style={{ height: 'auto' }}
            priority
          />
          <span className="font-semibold">Your Company</span>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="text-sm font-medium hover:underline"
          >
            Sign in
          </Link>
          <Link 
            href="/register" 
            className="rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-300"
          >
            Sign up
          </Link>
        </div>
      </nav>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          style={{ height: 'auto' }}
          priority
        />
        <div className="text-center sm:text-left space-y-4 max-w-xl">
          <h1 className="text-3xl font-bold tracking-tight">Your complete business management solution</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage tasks, create invoices, integrate with webhooks, and edit content all in one place.
          </p>
        </div>
        
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/login"
          >
            Sign in to dashboard
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/register"
          >
            Create an account
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-8">
          {/* Feature tiles */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Task Management</h3>
            <p className="text-sm text-gray-500">Organize and track your tasks with an integrated calendar view.</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Invoice Creation</h3>
            <p className="text-sm text-gray-500">Create professional invoices and quotations for your clients.</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Webhooks</h3>
            <p className="text-sm text-gray-500">Integrate with make.com and other services through webhooks.</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Content Management</h3>
            <p className="text-sm text-gray-500">Edit and manage your website content with ease.</p>
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
            style={{ height: 'auto' }}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
            style={{ height: 'auto' }}
          />
          Examples
        </a>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/dashboard"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
            style={{ height: 'auto' }}
          />
          Go to dashboard →
        </Link>
      </footer>
    </div>
  );
}
