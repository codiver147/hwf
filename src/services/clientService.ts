
import { supabase } from "@/integrations/supabase/client";

// Import type from generated Supabase types
type ClientRow = {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  languages_spoken: string | null;
  country_of_origin: string;
  status_in_canada: string;
  housing_type: string;
  has_transportation: boolean;
  number_of_adults: number;
  number_of_children: number;
  children_ages: string | null;
  reference_organization: string | null;
  // timestamp columns omitted; not used in core logic
};

export interface Client extends ClientRow {}

interface ClientFormData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  languagesSpoken?: string;
  countryOfOrigin: string;
  statusInCanada: string;
  housingType: string;
  hasTransportation: boolean;
  numberOfAdults: number;
  numberOfChildren: number;
  childrenAges?: string;
  referenceOrganization?: string;
}

export type CreateClientDto = Omit<Client, 'id'>;

// Helper: Convert DB client row (with number for has_transportation) -> Client (has_transportation as boolean)
function parseClientFromDb(row: any): Client {
  return {
    ...row,
    has_transportation: !!row.has_transportation, // Convert 0/1/NULL to boolean
  };
}

// List all clients
export const getClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("id", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(parseClientFromDb);
};

// Get single client by ID
export const getClient = async (id: number): Promise<Client> => {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Client not found");
  return parseClientFromDb(data);
};

// Create client
export const createClient = async (formData: ClientFormData): Promise<Client> => {
  // Convert boolean to number for Supabase
  const newClient = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email || null,
    phone: formData.phone || null,
    address: formData.address || null,
    city: formData.city || null,
    postal_code: formData.postalCode || null,
    languages_spoken: formData.languagesSpoken || null,
    country_of_origin: formData.countryOfOrigin,
    status_in_canada: formData.statusInCanada,
    housing_type: formData.housingType,
    has_transportation: formData.hasTransportation ? 1 : 0,
    number_of_adults: formData.numberOfAdults || 1,
    number_of_children: formData.numberOfChildren || 0,
    children_ages: formData.childrenAges || null,
    reference_organization: formData.referenceOrganization || null,
  };
  
  console.log("Creating client with data:", newClient);
  
  const { data, error } = await supabase
    .from("clients")
    .insert([newClient])
    .select()
    .single();
  if (error) throw error;
  return parseClientFromDb(data);
};

// Update client
export const updateClient = async (id: number, formData: ClientFormData): Promise<Client> => {
  // Convert boolean to number for Supabase
  const updatedClient = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email || null,
    phone: formData.phone || null,
    address: formData.address || null,
    city: formData.city || null,
    postal_code: formData.postalCode || null,
    languages_spoken: formData.languagesSpoken || null,
    country_of_origin: formData.countryOfOrigin,
    status_in_canada: formData.statusInCanada,
    housing_type: formData.housingType,
    has_transportation: formData.hasTransportation ? 1 : 0,
    number_of_adults: formData.numberOfAdults || 1,
    number_of_children: formData.numberOfChildren || 0,
    children_ages: formData.childrenAges || null,
    reference_organization: formData.referenceOrganization || null,
  };
  
  console.log("Updating client with data:", updatedClient);
  
  const { data, error } = await supabase
    .from("clients")
    .update(updatedClient)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return parseClientFromDb(data);
};

// Delete client with proper foreign key handling
export const deleteClient = async (id: number): Promise<void> => {
  console.log("Attempting to delete client with ID:", id);
  
  try {
    // First check if client has any associated requests
    const { data: requests, error: requestsError } = await supabase
      .from("requests")
      .select("id")
      .eq("client_id", id);
    
    if (requestsError) {
      console.error("Error checking client requests:", requestsError);
      throw requestsError;
    }
    
    if (requests && requests.length > 0) {
      console.log("Client has associated requests:", requests.length);
      throw new Error(`Impossible de supprimer ce client car il a ${requests.length} demande(s) associée(s). Veuillez d'abord supprimer les demandes.`);
    }
    
    // If no requests, proceed with deletion
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting client:", error);
      throw error;
    }
    
    console.log("Client deleted successfully");
  } catch (error) {
    console.error("Error in deleteClient:", error);
    throw error;
  }
};
