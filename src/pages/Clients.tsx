
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  UserPlus, 
  Search
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/client/columns";

export default function Clients() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients
  });

  const filteredClients = clients.filter(client => 
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.country_of_origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.languages_spoken && client.languages_spoken.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (client.reference_organization && client.reference_organization.toLowerCase().includes(searchQuery.toLowerCase())) ||
    String(client.id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('pages.clients.title')}</h1>
          <p className="text-muted-foreground">
            {t('pages.clients.manage')}
          </p>
        </div>
        <Button 
          className="bg-hwf-purple hover:bg-hwf-purple-dark"
          onClick={() => navigate("/clients/add")}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          {t('actions.addClient')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('client.directory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('client.searchClients')}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <DataTable 
            columns={columns}
            data={filteredClients}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
