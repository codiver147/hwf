
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ScheduleSelect({ form }: { form: any }) {
  const { t, language } = useLanguage();
  const date = form.watch("date");
  const time = form.watch("time");

  // Mise à jour du scheduled_at quand date ou time change
  useEffect(() => {
    if (date) {
      let scheduled = new Date(date);

      if (time) {
        const [hours, minutes] = time.split(':').map(Number);
        scheduled.setHours(hours, minutes);
      }

      form.setValue("scheduled_at", scheduled);
      console.log("Updated scheduled_at:", scheduled);
    }
  }, [date, time, form]);

  const dateLocale = language === 'fr' ? fr : enUS;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{t('request.date')}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "P", { locale: dateLocale })
                    ) : (
                      <span>{t('request.selectDate')}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('request.time')}</FormLabel>
            <FormControl>
              <Input
                type="time"
                placeholder="HH:MM"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  if (date && e.target.value) {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    const newDate = new Date(date);
                    newDate.setHours(hours, minutes);
                    form.setValue("scheduled_at", newDate);
                    console.log("Updated scheduled_at from time change:", newDate);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
