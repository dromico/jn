"use client";

import { SchemaErrorNotification } from "@/components/invoices/error-helper";

interface ErrorMessageProps {
  error: string | null;
  onClose: () => void;
}

export default function ErrorMessage({ error, onClose }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <>
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
        role="alert"
        data-oid="2p6xu5f"
      >
        <span className="block sm:inline" data-oid="cu52h93">
          {error}
        </span>
        <button
          onClick={onClose}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
          data-oid="giy-kyx"
        >
          <span className="sr-only" data-oid="n7cc4l.">
            Close
          </span>
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            data-oid="xxwyvk2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
              data-oid="i1kzzhs"
            />
          </svg>
        </button>
      </div>

      {/* Show schema help component when error is related to type column */}
      <SchemaErrorNotification errorMessage={error} data-oid="j7d0:5o" />
    </>
  );
}
