DROP POLICY IF EXISTS "Users can create their own role" ON public.user_roles;

CREATE POLICY "Users can create their own brand role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND role = 'brand'::public.app_role);