import { RegisterForm } from "@/components/auth/register-form";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8"
      data-oid="ed17t2n"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md" data-oid="nw.w_bt">
        <div className="flex justify-center" data-oid="4olo.m0">
          <Link href="/" data-oid="5y07-c:">
            <Image
              src="/next.svg"
              alt="Logo"
              width={80}
              height={20}
              priority
              className="dark:invert"
              data-oid="t541sru"
            />
          </Link>
        </div>
        <h2
          className="mt-6 text-center text-2xl font-bold tracking-tight"
          data-oid="fr3pef6"
        >
          Create a new account
        </h2>
        <p
          className="mt-2 text-center text-sm text-gray-600"
          data-oid="5omscn:"
        >
          Or{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
            data-oid="wwmywqr"
          >
            sign in to an existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" data-oid="-_zahrq">
        <div
          className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10"
          data-oid="tyefbl1"
        >
          <RegisterForm data-oid="4ue-dgi" />
        </div>
      </div>
    </div>
  );
}
