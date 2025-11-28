-- Function to automatically assign admin role to specific email
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Check if the user's email is ms11official9@gmail.com
  if new.email = 'ms11official9@gmail.com' then
    -- Insert admin role for this user
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin');
  end if;
  return new;
end;
$$;

-- Trigger to call the function after a new user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();