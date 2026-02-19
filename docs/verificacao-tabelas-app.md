# Verificação das tabelas da aplicação

Data da verificação: 2026-02-19.

## Resultado

A lista de tabelas tipadas em `src/integrations/supabase/types.ts` está **alinhada** com as tabelas criadas nas migrations SQL em `supabase/migrations`.

Tabelas verificadas:

- assets
- facilities
- moc_approvers
- moc_attachments
- moc_comments
- moc_history
- moc_requests
- moc_tasks
- notifications
- profiles
- user_roles
- work_orders

## Evidências rápidas

- Tipos de banco (fonte do app): `src/integrations/supabase/types.ts`
- Criação de tabelas (fonte SQL):
  - `supabase/migrations/20260206125054_55902d55-3af6-4483-8c4e-09d5d961e76b.sql`
  - `supabase/migrations/20260207030107_959f69b3-49ae-4eba-a7a1-eaba7a84d460.sql`
  - `supabase/migrations/20260209110831_aa061ec3-78bd-4049-9230-591867dc698d.sql`
  - `supabase/migrations/20260209111143_b9c6936d-d620-4455-8b74-e1559953834c.sql`
