-- Supabase Auth UUID track. Apply to a NEW learning project with synthetic data.
-- This lab permits owner-managed MANUAL transactions. Provider-imported facts
-- belong in a separate server-writable model before live banking is introduced.
begin;

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  currency text not null check (currency in ('USD', 'CAD')),
  unique (id, owner_id, currency)
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null,
  currency text not null check (currency in ('USD', 'CAD')),
  merchant text not null check (char_length(merchant) between 1 and 200),
  amount_minor bigint not null check (amount_minor between -9007199254740991 and 9007199254740991),
  posted_on date not null,
  pending boolean not null default false,
  created_at timestamptz not null default now(),
  unique (id, owner_id),
  foreign key (account_id, owner_id, currency) references public.accounts(id, owner_id, currency) on delete cascade
);
create index transactions_owner_date on public.transactions(owner_id, posted_on desc, id desc);

create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  category_id text not null check (char_length(category_id) between 1 and 80),
  name text not null check (char_length(name) between 1 and 80),
  currency text not null check (currency in ('USD', 'CAD')),
  period_start date not null,
  period_end date not null,
  limit_minor bigint not null check (limit_minor between 0 and 9007199254740991),
  check (period_end > period_start),
  unique (owner_id, category_id, currency, period_start, period_end)
);
create index budgets_owner_period on public.budgets(owner_id, period_start);

create table public.transaction_annotations (
  transaction_id uuid primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  category_id text,
  note text check (char_length(note) <= 2000),
  excluded boolean not null default false,
  foreign key (transaction_id, owner_id) references public.transactions(id, owner_id) on delete cascade
);

alter table public.accounts enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.transaction_annotations enable row level security;

create policy accounts_owner on public.accounts for all to authenticated
  using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy transactions_owner on public.transactions for all to authenticated
  using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy budgets_owner on public.budgets for all to authenticated
  using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy annotations_owner on public.transaction_annotations for all to authenticated
  using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);

revoke all on public.accounts, public.transactions, public.budgets, public.transaction_annotations from anon;
grant select, insert, update, delete on public.accounts, public.transactions, public.budgets, public.transaction_annotations to authenticated;
commit;
