
-- Create a junction table to handle multiple teams per request
CREATE TABLE public.request_teams (
  id SERIAL PRIMARY KEY,
  request_id INTEGER NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  team_id INTEGER NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(request_id, team_id)
);

-- Enable RLS on the new table
ALTER TABLE public.request_teams ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for request_teams
CREATE POLICY "Allow read access to request teams for authenticated users"
  ON public.request_teams
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert access to request teams for authenticated users"
  ON public.request_teams
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update access to request teams for authenticated users"
  ON public.request_teams
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow delete access to request teams for authenticated users"
  ON public.request_teams
  FOR DELETE
  USING (true);
