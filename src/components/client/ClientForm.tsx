
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { countries, languages } from "@/utils/countries";
import { useLanguage } from "@/contexts/LanguageContext";

const statusInCanadaType = z.enum(["permanent-resident", "refugee", "student-visa", "temporary-resident"]);

const clientSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  languagesSpoken: z.string().optional(),
  countryOfOrigin: z.string().min(1, "Country of origin is required"),
  referenceOrganization: z.string().optional(),
  statusInCanada: statusInCanadaType,
  housingType: z.string(),
  hasTransportation: z.boolean().default(false),
  numberOfAdults: z.number().int().min(1).default(1),
  numberOfChildren: z.number().int().min(0).default(0),
  childrenAges: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  defaultValues?: Partial<ClientFormData>;
  onSubmit: (data: ClientFormData) => void;
  isEditing?: boolean;
}

export function ClientForm({ defaultValues, onSubmit, isEditing = false }: ClientFormProps) {
  const { language, t } = useLanguage();
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      languagesSpoken: "",
      countryOfOrigin: "",
      statusInCanada: "permanent-resident",
      housingType: "Apartment",
      hasTransportation: false,
      numberOfAdults: 1,
      numberOfChildren: 0,
      childrenAges: "",
      referenceOrganization: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('client.firstName')}*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('client.lastName')}*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('client.email')}</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" type="email" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('client.phone')}</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="countryOfOrigin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('client.countryOfOrigin')}*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select country of origin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.name.en}>
                        {country.name[language] || country.name.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="languagesSpoken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('client.languagesSpoken')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select primary language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.name.en}>
                        {lang.name[language] || lang.name.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="statusInCanada"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('client.statusInCanada')}*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="permanent-resident">{t('status.permanentResident')}</SelectItem>
                    <SelectItem value="refugee">{t('status.refugee')}</SelectItem>
                    <SelectItem value="student-visa">{t('status.studentVisa')}</SelectItem>
                    <SelectItem value="temporary-resident">{t('status.temporaryResident')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="housingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('client.housingType')}*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select housing type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Apartment">{t('housing.apartment')}</SelectItem>
                    <SelectItem value="House">{t('housing.house')}</SelectItem>
                    <SelectItem value="Townhouse">{t('housing.townhouse')}</SelectItem>
                    <SelectItem value="Basement Apartment">{t('housing.basementApartment')}</SelectItem>
                    <SelectItem value="Temporary">{t('housing.temporary')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="referenceOrganization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('client.referenceOrganization')}</FormLabel>
                <FormControl>
                  <Input placeholder="Enter reference organization" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('client.address')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('client.address')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter street address" {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('client.city')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('client.postalCode')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter postal code" {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Household Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informations du ménage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <FormField
              control={form.control}
              name="numberOfAdults"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('client.numberOfAdults')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      className="bg-white" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberOfChildren"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('client.numberOfChildren')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      className="bg-white" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="childrenAges"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t('client.childrenAges')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="E.g., 2, 5, 10 years old" 
                      {...field} 
                      className="bg-white resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Please list the ages of all children separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="hasTransportation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{t('client.hasTransportation')}</FormLabel>
                <FormDescription>Check if the client has access to their own transportation</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button type="submit">
            {isEditing ? "Update Client" : "Add Client"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
