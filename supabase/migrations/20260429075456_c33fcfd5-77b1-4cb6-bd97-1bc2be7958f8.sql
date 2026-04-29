DROP POLICY IF EXISTS "Users can create their own team profile" ON public.team_member_profiles;
DROP POLICY IF EXISTS "Users can update their own team profile" ON public.team_member_profiles;

CREATE POLICY "Team members can create their own team profile"
ON public.team_member_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'styly_team'::public.app_role));

CREATE POLICY "Team members can update their own team profile"
ON public.team_member_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND public.has_role(auth.uid(), 'styly_team'::public.app_role))
WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'styly_team'::public.app_role));