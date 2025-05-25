"use client";

import { useEffect, useState } from 'react';

export function SchemaErrorNotification({ errorMessage }: { errorMessage: string }) {
  const [showHelper, setShowHelper] = useState(false);

  useEffect(() => {
    // Check if this is a schema error related to the 'type' column
    if (errorMessage &&
        (errorMessage.includes('type') &&
         (errorMessage.includes('column') ||
          errorMessage.includes('schema cache')))) {
      setShowHelper(true);
    } else {
      setShowHelper(false);
    }
  }, [errorMessage]);

  if (!showHelper) {
    return null;
  }

  return (
    <div className="p-4 mt-4 mb-4 bg-amber-50 border border-amber-200 rounded">
      <h3 className="text-lg font-medium mb-2">Database Schema Issue Detected</h3>
      <p className="mb-2">
        It looks like your database schema needs to be updated to include the &apos;type&apos; column for invoices.
      </p>
      <p className="mb-4">
        This often happens during initial setup or after database updates.
      </p>
      <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto max-h-40">
        <pre className="text-xs whitespace-pre-wrap">
          <code>
{`-- Run this SQL in your Supabase SQL Editor:

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'invoices'
    AND column_name = 'type'
  ) THEN
    ALTER TABLE invoices
    ADD COLUMN type text check (type in ('invoice', 'quotation')) default 'invoice';
  END IF;
END $$;

-- Update any existing records to have the type set
UPDATE invoices
SET type = 'invoice'
WHERE type IS NULL;`}
          </code>
        </pre>
      </div>
      <p className="mb-2 text-sm">
        Check the README.md file for detailed instructions on how to fix this issue.
      </p>
      <div className="flex gap-2">
        <a
          href="https://github.com/your-repo/README.md#database-schema-fix"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          View README for detailed fix instructions
        </a>
      </div>
    </div>
  );
}