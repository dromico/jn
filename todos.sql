create table todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  title text not null,
  description text,
  due_date date,
  completed boolean default false,
  priority text check (priority in ('low', 'medium', 'high')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS (Row Level Security)
alter table todos enable row level security;

-- Create policy to only allow users to see their own todos
create policy "Users can only see their own todos"
  on todos for select
  using (auth.uid() = user_id);

-- Create policy to only allow users to insert their own todos
create policy "Users can only insert their own todos"
  on todos for insert
  with check (auth.uid() = user_id);

-- Create policy to only allow users to update their own todos
create policy "Users can only update their own todos"
  on todos for update
  using (auth.uid() = user_id);

-- Create policy to only allow users to delete their own todos
create policy "Users can only delete their own todos"
  on todos for delete
  using (auth.uid() = user_id);