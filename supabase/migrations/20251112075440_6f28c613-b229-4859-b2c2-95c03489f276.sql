-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create table for health data
CREATE TABLE public.health_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  age INT NOT NULL,
  gender INT NOT NULL CHECK (gender IN (0, 1)),
  weight FLOAT NOT NULL,
  height FLOAT NOT NULL,
  bmi FLOAT NOT NULL,
  workout_frequency INT NOT NULL CHECK (workout_frequency >= 0 AND workout_frequency <= 7),
  session_duration FLOAT NOT NULL,
  workout_type TEXT NOT NULL,
  daily_meals_frequency INT NOT NULL,
  diet_type TEXT NOT NULL,
  calories FLOAT NOT NULL,
  physical_exercise TEXT NOT NULL,
  prediction_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.health_data ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own health data" 
ON public.health_data 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health data" 
ON public.health_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health data" 
ON public.health_data 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health data" 
ON public.health_data 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_health_data_updated_at
BEFORE UPDATE ON public.health_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();