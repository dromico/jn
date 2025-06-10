-- Invoice and InvoiceItem table definitions for Supabase

-- Create customers table to store customer information
create table customers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  name text not null,
  email text,
  address text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security for customers table
alter table customers enable row level security;

-- Create policies for customers
create policy "Users can only view their own customers"
  on customers for select
  using (auth.uid() = user_id);

create policy "Users can only insert their own customers"
  on customers for insert
  with check (auth.uid() = user_id);

create policy "Users can only update their own customers"
  on customers for update
  using (auth.uid() = user_id);

create policy "Users can only delete their own customers"
  on customers for delete
  using (auth.uid() = user_id);

-- Create invoices table
create table invoices (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  number text not null,
  customer_id uuid references customers(id),
  customer_name text, -- Denormalized for convenience
  date date not null,
  due_date date not null,
  status text check (status in ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  total numeric(10,2) not null default 0,
  type text check (type in ('invoice', 'quotation')) default 'invoice',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security for invoices table
alter table invoices enable row level security;

-- Create policies for invoices
create policy "Users can only view their own invoices"
  on invoices for select
  using (auth.uid() = user_id);

create policy "Users can only insert their own invoices"
  on invoices for insert
  with check (auth.uid() = user_id);

create policy "Users can only update their own invoices"
  on invoices for update
  using (auth.uid() = user_id);

create policy "Users can only delete their own invoices"
  on invoices for delete
  using (auth.uid() = user_id);

-- Create invoice items table
create table invoice_items (
  id uuid default gen_random_uuid() primary key,
  invoice_id uuid references invoices(id) on delete cascade,
  description text not null,
  quantity numeric(10,2) not null default 1,
  price numeric(10,2) not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security for invoice items table
alter table invoice_items enable row level security;

-- Create policies for invoice items
-- We're using a join to check if the item belongs to an invoice owned by the current user
create policy "Users can only view their own invoice items"
  on invoice_items for select
  using (
    invoice_id in (
      select id from invoices where user_id = auth.uid()
    )
  );

create policy "Users can only insert their own invoice items"
  on invoice_items for insert
  with check (
    invoice_id in (
      select id from invoices where user_id = auth.uid()
    )
  );

create policy "Users can only update their own invoice items"
  on invoice_items for update
  using (
    invoice_id in (
      select id from invoices where user_id = auth.uid()
    )
  );

create policy "Users can only delete their own invoice items"
  on invoice_items for delete
  using (
    invoice_id in (
      select id from invoices where user_id = auth.uid()
    )
  );

-- Function to update invoice totals automatically
create or replace function update_invoice_total() 
returns trigger as $$
begin
  update invoices
  set total = (
    select coalesce(sum(quantity * price), 0)
    from invoice_items
    where invoice_id = NEW.invoice_id
  ),
  updated_at = now()
  where id = NEW.invoice_id;
  
  return NEW;
end;
$$ language plpgsql;

-- Trigger to update invoice totals when items are changed
create trigger update_invoice_total_trigger
after insert or update or delete on invoice_items
for each row
execute function update_invoice_total();

-- Add type column to existing invoices table if it doesn't exist
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