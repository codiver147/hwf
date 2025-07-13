-- Add missing foreign key constraints for the requests system

-- Add foreign key constraint between requests and clients
ALTER TABLE public.requests 
ADD CONSTRAINT fk_requests_client_id 
FOREIGN KEY (client_id) REFERENCES public.clients(id);

-- Add foreign key constraint between request_items and requests
ALTER TABLE public.request_items 
ADD CONSTRAINT fk_request_items_request_id 
FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE;

-- Add foreign key constraint between request_items and inventory_items
ALTER TABLE public.request_items 
ADD CONSTRAINT fk_request_items_inventory_item_id 
FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_items(id);

-- Add foreign key constraint between request_volunteers and requests
ALTER TABLE public.request_volunteers 
ADD CONSTRAINT fk_request_volunteers_request_id 
FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE;

-- Add foreign key constraint between request_volunteers and volunteers
ALTER TABLE public.request_volunteers 
ADD CONSTRAINT fk_request_volunteers_volunteer_id 
FOREIGN KEY (volunteer_id) REFERENCES public.volunteers(id);

-- Add foreign key constraint between inventory_items and inventory_categories
ALTER TABLE public.inventory_items 
ADD CONSTRAINT fk_inventory_items_category_id 
FOREIGN KEY (category_id) REFERENCES public.inventory_categories(id);

-- Add foreign key constraint between team_members and teams
ALTER TABLE public.team_members 
ADD CONSTRAINT fk_team_members_team_id 
FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

-- Add foreign key constraint between team_members and volunteers
ALTER TABLE public.team_members 
ADD CONSTRAINT fk_team_members_volunteer_id 
FOREIGN KEY (volunteer_id) REFERENCES public.volunteers(id);

-- Add foreign key constraint between team_skills and teams
ALTER TABLE public.team_skills 
ADD CONSTRAINT fk_team_skills_team_id 
FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;

-- Add foreign key constraint between team_skills and skills
ALTER TABLE public.team_skills 
ADD CONSTRAINT fk_team_skills_skill_id 
FOREIGN KEY (skill_id) REFERENCES public.skills(id);

-- Add foreign key constraint between volunteer_skills and volunteers
ALTER TABLE public.volunteer_skills 
ADD CONSTRAINT fk_volunteer_skills_volunteer_id 
FOREIGN KEY (volunteer_id) REFERENCES public.volunteers(id) ON DELETE CASCADE;

-- Add foreign key constraint between volunteer_skills and skills
ALTER TABLE public.volunteer_skills 
ADD CONSTRAINT fk_volunteer_skills_skill_id 
FOREIGN KEY (skill_id) REFERENCES public.skills(id);

-- Add foreign key constraint between delivery_assignments and requests
ALTER TABLE public.delivery_assignments 
ADD CONSTRAINT fk_delivery_assignments_request_id 
FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE;

-- Add foreign key constraint between delivery_assignments and volunteers
ALTER TABLE public.delivery_assignments 
ADD CONSTRAINT fk_delivery_assignments_volunteer_id 
FOREIGN KEY (volunteer_id) REFERENCES public.volunteers(id);