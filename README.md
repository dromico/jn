This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Database Schema Fix

If you encounter the following error when creating or updating invoices:

```
Error creating invoice: Could not find the 'type' column of 'invoices' in the schema cache
```

This means the database schema needs to be updated. Follow these steps to fix it:

1. Go to the Supabase Dashboard for your project
2. Navigate to SQL Editor
3. Copy and paste the following SQL script:

```sql
-- Check if type column exists and add it if not
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
WHERE type IS NULL;
```

4. Run the SQL script
5. Refresh the application and try again

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
