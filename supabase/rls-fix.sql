-- Fix recursive admin policies that query profiles from inside profiles RLS.
-- Run this once in Supabase SQL Editor after schema.sql.

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = user_id
      AND role = 'admin'
  );
$$;

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all buyer companies" ON buyer_companies;
CREATE POLICY "Admins can view all buyer companies" ON buyer_companies
  FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all applications" ON applications;
CREATE POLICY "Admins can manage all applications" ON applications
  FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all suppliers" ON suppliers;
CREATE POLICY "Admins can manage all suppliers" ON suppliers
  FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins see all orders" ON orders;
CREATE POLICY "Admins see all orders" ON orders
  FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage all inquiries" ON inquiries;
CREATE POLICY "Admins manage all inquiries" ON inquiries
  FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage escrow" ON escrow_transactions;
CREATE POLICY "Admins manage escrow" ON escrow_transactions
  FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage all posts" ON blog_posts;
CREATE POLICY "Admins manage all posts" ON blog_posts
  FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage sanctions log" ON sanctions_log;
CREATE POLICY "Admins manage sanctions log" ON sanctions_log
  FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage marketing orders" ON marketing_service_orders;
CREATE POLICY "Admins manage marketing orders" ON marketing_service_orders
  FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage admin tasks" ON admin_tasks;
CREATE POLICY "Admins manage admin tasks" ON admin_tasks
  FOR ALL USING (public.is_admin(auth.uid()));
