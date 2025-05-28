
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

interface Client {
  id: number;
  first_name: string;
  last_name: string;
}

interface ClientSelectProps {
  form: UseFormReturn<any>;
}

export const ClientSelect = ({ form }: ClientSelectProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('id, first_name, last_name')
          .order('last_name');
        
        if (error) throw error;
        setClients(data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter(client =>
    `${client.first_name} ${client.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <FormField
      control={form.control}
      name="clientId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Client</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un client" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <div className="p-2">
                <input
                  className="w-full rounded-md border border-input px-3 py-2 text-sm"
                  placeholder="Rechercher un client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {isLoading ? (
                <SelectItem value="loading" disabled>Chargement...</SelectItem>
              ) : filteredClients.length === 0 ? (
                <SelectItem value="empty" disabled>Aucun client trouvé</SelectItem>
              ) : (
                filteredClients.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.first_name} {client.last_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
