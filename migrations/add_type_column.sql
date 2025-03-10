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

-- Add 'type' to the RETURN definition of update_invoice_total function
CREATE OR REPLACE FUNCTION update_invoice_total() 
RETURNS trigger AS $$
BEGIN
  UPDATE invoices
  SET 
    total = (
      SELECT coalesce(sum(quantity * price), 0)
      FROM invoice_items
      WHERE invoice_id = NEW.invoice_id
    ),
    updated_at = now()
  WHERE id = NEW.invoice_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;