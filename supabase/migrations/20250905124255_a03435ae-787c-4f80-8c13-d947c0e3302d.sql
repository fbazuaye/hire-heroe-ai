-- Create cover letters table
CREATE TABLE public.cover_letters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  content TEXT NOT NULL,
  job_description TEXT,
  tone TEXT DEFAULT 'professional',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cover letters" 
ON public.cover_letters 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  job_url TEXT,
  application_date DATE,
  status TEXT DEFAULT 'applied',
  salary_range TEXT,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own applications" 
ON public.job_applications 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create networking contacts table
CREATE TABLE public.networking_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  email TEXT,
  linkedin_url TEXT,
  relationship_type TEXT,
  last_contact_date DATE,
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.networking_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own contacts" 
ON public.networking_contacts 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create skills assessments table
CREATE TABLE public.skills_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency_level INTEGER CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  assessment_type TEXT DEFAULT 'self',
  certification_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.skills_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own assessments" 
ON public.skills_assessments 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create motivational content table
CREATE TABLE public.motivational_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'quote', 'tip', 'milestone', 'celebration'
  title TEXT,
  content TEXT NOT NULL,
  category TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.motivational_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own motivational content" 
ON public.motivational_content 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);