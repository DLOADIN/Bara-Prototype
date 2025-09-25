-- Create country_info table to replace Wikipedia data
CREATE TABLE public.country_info (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  country_id uuid NOT NULL,
  
  -- Basic Information
  description text,
  capital text,
  currency text,
  language text,
  population bigint,
  area_sq_km numeric,
  
  -- Government & Leadership
  president_name text,
  government_type text,
  formation_date date,
  
  -- Economic Information
  gdp_usd numeric,
  gdp_per_capita numeric,
  currency_code text,
  
  -- Geographic Information
  latitude numeric,
  longitude numeric,
  timezone text,
  calling_code text,
  
  -- Demographics
  average_age numeric,
  largest_city text,
  largest_city_population bigint,
  capital_population bigint,
  
  -- Development Indicators
  hdi_score numeric,
  literacy_rate numeric,
  life_expectancy numeric,
  
  -- Cultural Information
  ethnic_groups jsonb, -- Array of {name, percentage, note}
  religions jsonb, -- Array of {name, percentage}
  national_holidays jsonb, -- Array of {name, date}
  
  -- Visual Assets
  flag_url text,
  coat_of_arms_url text,
  national_anthem_url text,
  
  -- Additional Information
  climate text,
  natural_resources text,
  main_industries text,
  tourism_attractions text,
  
  -- Administrative
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  
  CONSTRAINT country_info_pkey PRIMARY KEY (id),
  CONSTRAINT country_info_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id) ON DELETE CASCADE,
  CONSTRAINT country_info_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT country_info_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_country_info_country_id ON public.country_info(country_id);
CREATE INDEX idx_country_info_is_active ON public.country_info(is_active);

-- Enable RLS (Row Level Security)
ALTER TABLE public.country_info ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Country info is viewable by everyone" ON public.country_info
  FOR SELECT USING (true);

CREATE POLICY "Country info is manageable by authenticated users" ON public.country_info
  FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_country_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_country_info_updated_at
  BEFORE UPDATE ON public.country_info
  FOR EACH ROW
  EXECUTE FUNCTION update_country_info_updated_at();

-- Insert sample data for testing
INSERT INTO public.country_info (
  country_id,
  description,
  capital,
  currency,
  language,
  population,
  area_sq_km,
  president_name,
  government_type,
  formation_date,
  gdp_usd,
  gdp_per_capita,
  currency_code,
  latitude,
  longitude,
  timezone,
  calling_code,
  average_age,
  largest_city,
  largest_city_population,
  capital_population,
  hdi_score,
  literacy_rate,
  life_expectancy,
  ethnic_groups,
  religions,
  national_holidays,
  climate,
  natural_resources,
  main_industries,
  tourism_attractions
) VALUES (
  (SELECT id FROM public.countries WHERE name = 'Egypt' LIMIT 1),
  'Egypt is a transcontinental country spanning the northeast corner of Africa and southwest corner of Asia via a land bridge formed by the Sinai Peninsula. It is bordered by the Mediterranean Sea to the north, the Gaza Strip and Israel to the northeast, the Red Sea to the east, Sudan to the south, and Libya to the west.',
  'Cairo',
  'Egyptian Pound',
  'Arabic',
  102334000,
  1001449,
  'Abdel Fattah el-Sisi',
  'Semi-presidential republic',
  '1922-02-28',
  4041000000000,
  4000,
  'EGP',
  26.8206,
  30.8025,
  'UTC+2',
  '+20',
  25.3,
  'Cairo',
  20000000,
  10000000,
  0.707,
  71.2,
  72.0,
  '[{"name": "Egyptians", "percentage": 99.6, "note": "Mainly Arabs"}, {"name": "Nubians", "percentage": 0.4, "note": "Southern Egypt"}]',
  '[{"name": "Islam", "percentage": 90}, {"name": "Christianity", "percentage": 10}]',
  '[{"name": "Revolution Day", "date": "2025-01-25"}, {"name": "Independence Day", "date": "2025-02-28"}]',
  'Desert climate with hot summers and mild winters',
  'Petroleum, natural gas, iron ore, phosphates, manganese, limestone, gypsum, talc, asbestos, lead, zinc',
  'Petroleum, textiles, food processing, tourism, chemicals, pharmaceuticals, hydrocarbons, construction, cement, metals, light manufactures',
  'Pyramids of Giza, Sphinx, Valley of the Kings, Abu Simbel, Red Sea resorts, Nile River cruises'
) ON CONFLICT DO NOTHING;
