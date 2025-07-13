-- Clean up orphaned data before adding foreign key constraints

-- First, let's see what orphaned data we have and clean it up
-- Delete requests that reference non-existent clients
DELETE FROM public.requests 
WHERE client_id IS NOT NULL 
AND client_id NOT IN (SELECT id FROM public.clients);

-- Delete request_items that reference non-existent requests
DELETE FROM public.request_items 
WHERE request_id NOT IN (SELECT id FROM public.requests);

-- Delete request_items that reference non-existent inventory items
DELETE FROM public.request_items 
WHERE inventory_item_id NOT IN (SELECT id FROM public.inventory_items);

-- Delete request_volunteers that reference non-existent requests
DELETE FROM public.request_volunteers 
WHERE request_id IS NOT NULL 
AND request_id NOT IN (SELECT id FROM public.requests);

-- Delete request_volunteers that reference non-existent volunteers
DELETE FROM public.request_volunteers 
WHERE volunteer_id IS NOT NULL 
AND volunteer_id NOT IN (SELECT id FROM public.volunteers);

-- Delete inventory_items that reference non-existent categories
UPDATE public.inventory_items 
SET category_id = NULL 
WHERE category_id IS NOT NULL 
AND category_id NOT IN (SELECT id FROM public.inventory_categories);

-- Delete team_members that reference non-existent teams
DELETE FROM public.team_members 
WHERE team_id IS NOT NULL 
AND team_id NOT IN (SELECT id FROM public.teams);

-- Delete team_members that reference non-existent volunteers
DELETE FROM public.team_members 
WHERE volunteer_id IS NOT NULL 
AND volunteer_id NOT IN (SELECT id FROM public.volunteers);

-- Delete team_skills that reference non-existent teams
DELETE FROM public.team_skills 
WHERE team_id IS NOT NULL 
AND team_id NOT IN (SELECT id FROM public.teams);

-- Delete team_skills that reference non-existent skills
DELETE FROM public.team_skills 
WHERE skill_id IS NOT NULL 
AND skill_id NOT IN (SELECT id FROM public.skills);

-- Delete volunteer_skills that reference non-existent volunteers
DELETE FROM public.volunteer_skills 
WHERE volunteer_id NOT IN (SELECT id FROM public.volunteers);

-- Delete volunteer_skills that reference non-existent skills
DELETE FROM public.volunteer_skills 
WHERE skill_id NOT IN (SELECT id FROM public.skills);

-- Delete delivery_assignments that reference non-existent requests
DELETE FROM public.delivery_assignments 
WHERE request_id IS NOT NULL 
AND request_id NOT IN (SELECT id FROM public.requests);

-- Delete delivery_assignments that reference non-existent volunteers
DELETE FROM public.delivery_assignments 
WHERE volunteer_id IS NOT NULL 
AND volunteer_id NOT IN (SELECT id FROM public.volunteers);