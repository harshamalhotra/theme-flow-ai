
-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'Manual Entry',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  sentiment NUMERIC DEFAULT 0,
  themes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read feedback (public dashboard)
CREATE POLICY "Anyone can read feedback"
  ON public.feedback
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone to insert feedback (public submission)
CREATE POLICY "Anyone can insert feedback"
  ON public.feedback
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
