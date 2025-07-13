
-- Add foreign key constraints to establish proper relationships
ALTER TABLE public.requests 
ADD CONSTRAINT fk_requests_client 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;

ALTER TABLE public.requests 
ADD CONSTRAINT fk_requests_team 
FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE SET NULL;

-- Also add missing foreign keys for other tables to ensure data integrity
ALTER TABLE public.request_items 
ADD CONSTRAINT fk_request_items_request 
FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE;

ALTER TABLE public.request_items 
ADD CONSTRAINT fk_request_items_inventory 
FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_items(id) ON DELETE CASCADE;

ALTER TABLE public.request_volunteers 
ADD CONSTRAINT fk_request_volunteers_request 
FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE;

ALTER TABLE public.request_volunteers 
ADD CONSTRAINT fk_request_volunteers_volunteer 
FOREIGN KEY (volunteer_id) REFERENCES public.volunteers(id) ON DELETE CASCADE;

ALTER TABLE public.delivery_assignments 
ADD CONSTRAINT fk_delivery_assignments_request 
FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE;

ALTER TABLE public.delivery_assignments 
ADD CONSTRAINT fk_delivery_assignments_volunteer 
FOREIGN KEY (volunteer_id) REFERENCES public.volunteers(id) ON DELETE CASCADE;
