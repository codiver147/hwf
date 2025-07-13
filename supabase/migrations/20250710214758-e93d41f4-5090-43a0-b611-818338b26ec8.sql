
-- Add foreign key constraint between requests and clients tables
ALTER TABLE public.requests 
ADD CONSTRAINT fk_requests_client_id 
FOREIGN KEY (client_id) REFERENCES public.clients(id);

-- Add foreign key constraint between requests and teams tables  
ALTER TABLE public.requests 
ADD CONSTRAINT fk_requests_team_id 
FOREIGN KEY (team_id) REFERENCES public.teams(id);

-- Add foreign key constraint between request_items and inventory_items
ALTER TABLE public.request_items 
ADD CONSTRAINT fk_request_items_inventory_item_id 
FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_items(id);

-- Add foreign key constraint between request_items and requests
ALTER TABLE public.request_items 
ADD CONSTRAINT fk_request_items_request_id 
FOREIGN KEY (request_id) REFERENCES public.requests(id);

-- Add foreign key constraint between request_volunteers and volunteers
ALTER TABLE public.request_volunteers 
ADD CONSTRAINT fk_request_volunteers_volunteer_id 
FOREIGN KEY (volunteer_id) REFERENCES public.volunteers(id);

-- Add foreign key constraint between delivery_assignments and requests
ALTER TABLE public.delivery_assignments 
ADD CONSTRAINT fk_delivery_assignments_request_id 
FOREIGN KEY (request_id) REFERENCES public.requests(id);

-- Add foreign key constraint between delivery_assignments and volunteers
ALTER TABLE public.delivery_assignments 
ADD CONSTRAINT fk_delivery_assignments_volunteer_id 
FOREIGN KEY (volunteer_id) REFERENCES public.volunteers(id);
