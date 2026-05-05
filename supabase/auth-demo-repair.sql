-- ORIGINO demo auth repair
-- Use this only if the original demo users were seeded before auth.identities existed.
-- Password for all three demo users after running this file: OriginoDemo123!
-- This version does not delete or update profiles, so existing seeded content remains linked.

delete from auth.identities
where user_id in (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003'
);

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@origino.test', crypt('OriginoDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"ORIGINO Admin","role":"admin"}', now(), now()),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'seller@origino.test', crypt('OriginoDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Adeel Khan","role":"seller"}', now(), now()),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'buyer@origino.test', crypt('OriginoDemo123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Marta Klein","role":"buyer"}', now(), now())
on conflict (id) do update set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

update auth.users
set
  phone = null,
  confirmation_token = coalesce(confirmation_token, ''),
  recovery_token = coalesce(recovery_token, ''),
  email_change_token_new = coalesce(email_change_token_new, ''),
  email_change = coalesce(email_change, ''),
  phone_change = coalesce(phone_change, ''),
  phone_change_token = coalesce(phone_change_token, ''),
  email_change_token_current = coalesce(email_change_token_current, ''),
  email_change_confirm_status = coalesce(email_change_confirm_status, 0),
  reauthentication_token = coalesce(reauthentication_token, ''),
  is_sso_user = coalesce(is_sso_user, false),
  is_anonymous = coalesce(is_anonymous, false),
  updated_at = now()
where id in (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003'
);

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) values
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '{"sub":"00000000-0000-0000-0000-000000000001","email":"admin@origino.test","email_verified":true,"phone_verified":false}', 'email', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '{"sub":"00000000-0000-0000-0000-000000000002","email":"seller@origino.test","email_verified":true,"phone_verified":false}', 'email', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', '{"sub":"00000000-0000-0000-0000-000000000003","email":"buyer@origino.test","email_verified":true,"phone_verified":false}', 'email', now(), now(), now());

insert into profiles (id, email, full_name, role, phone, country, preferred_language)
select *
from (
  values
    ('00000000-0000-0000-0000-000000000001'::uuid, 'admin@origino.test', 'ORIGINO Admin', 'admin', null, 'Pakistan', 'en'),
    ('00000000-0000-0000-0000-000000000002'::uuid, 'seller@origino.test', 'Adeel Khan', 'seller', null, 'Pakistan', 'en'),
    ('00000000-0000-0000-0000-000000000003'::uuid, 'buyer@origino.test', 'Marta Klein', 'buyer', null, 'Germany', 'en')
) as seed_profiles(id, email, full_name, role, phone, country, preferred_language)
where not exists (
  select 1
  from profiles
  where profiles.id = seed_profiles.id
);
