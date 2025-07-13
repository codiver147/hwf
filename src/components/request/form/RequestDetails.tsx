
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";

interface RequestDetailsProps {
  form: UseFormReturn<any>;
}

export const RequestDetails = ({ form }: RequestDetailsProps) => {
  const { t } = useLanguage();
  return (
    <>
      <FormField
        control={form.control}
        name="priority"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('request.priority')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('request.selectPriority')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="low">{t('priority.low')}</SelectItem>
                <SelectItem value="medium">{t('priority.medium')}</SelectItem>
                <SelectItem value="high">{t('priority.high')}</SelectItem>
                <SelectItem value="urgent">{t('priority.urgent')}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
        
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('request.status')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('request.selectStatus')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="new">{t('status.new')}</SelectItem>
                <SelectItem value="in progress">{t('status.inProgress')}</SelectItem>
                <SelectItem value="completed">{t('status.completed')}</SelectItem>
                <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('request.location')}</FormLabel>
            <FormControl>
              <Input placeholder={t('request.enterLocation')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>{t('request.description')}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t('request.enterDescription')} 
                className="min-h-[120px] resize-none" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
