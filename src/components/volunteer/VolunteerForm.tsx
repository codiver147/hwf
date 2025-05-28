
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getSkills } from "@/services/volunteerService";

// Définir le schéma de validation
const volunteerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(5, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Please enter a valid address" }),
  skills: z.array(z.string()).min(1, { message: "Select at least one skill" }),
  status: z.enum(["active", "inactive", "pending"]),
  startDate: z.date(),
  emergencyContact: z.string().min(5, { message: "Please provide emergency contact information" }),
  notes: z.string().optional(),
});

type VolunteerFormValues = z.infer<typeof volunteerSchema>;

interface AvailabilitySlot {
  day: string;
  time: string;
}

// Définir les jours de la semaine
const daysOfWeek = [
  { id: "dimanche", label: "Dimanche" },
  { id: "lundi", label: "Lundi" },
  { id: "mardi", label: "Mardi" },
  { id: "mercredi", label: "Mercredi" },
  { id: "jeudi", label: "Jeudi" },
  { id: "vendredi", label: "Vendredi" },
  { id: "samedi", label: "Samedi" },
];

// Définir les options de temps
const timeOptions = [
  { id: "matin", label: "Matin" },
  { id: "apres-midi", label: "Après-midi" },
  { id: "soir", label: "Soir" },
];

interface VolunteerFormProps {
  defaultValues?: any;
  onSubmit: (data: VolunteerFormValues & { availabilitySlots: Record<string, string> }) => void;
  isEditing?: boolean;
}

export function VolunteerForm({ defaultValues, onSubmit, isEditing = false }: VolunteerFormProps) {
  const [availabilitySlots, setAvailabilitySlots] = useState<Record<string, string>>({});
  const [day, setDay] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillOptions, setSkillOptions] = useState<{id: string, label: string}[]>([]);

  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      phone: "",
      address: "",
      skills: [],
      status: "active",
      startDate: new Date(),
      emergencyContact: "",
      notes: "",
    },
  });

  useEffect(() => {
    // Fetch skills from the database
    const loadSkills = async () => {
      try {
        const skills = await getSkills();
        const formattedSkills = skills.map(skill => ({
          id: skill.name,
          label: skill.name
        }));
        setSkillOptions(formattedSkills);
      } catch (error) {
        console.error("Error loading skills:", error);
        toast({
          title: "Error",
          description: "Failed to load skills",
          variant: "destructive",
        });
      }
    };
    
    loadSkills();
  }, [toast]);

  useEffect(() => {
    if (defaultValues?.availability) {
      let parsedAvailability;
      if (typeof defaultValues.availability === 'string') {
        try {
          parsedAvailability = JSON.parse(defaultValues.availability);
        } catch (e) {
          console.error("Error parsing availability JSON:", e);
          parsedAvailability = {};
        }
      } else {
        parsedAvailability = defaultValues.availability;
      }
      
      setAvailabilitySlots(parsedAvailability);
    }
    
    // Make sure emergency contact is set properly
    if (defaultValues?.emergency_contact && !form.getValues("emergencyContact")) {
      form.setValue("emergencyContact", defaultValues.emergency_contact);
    }
  }, [defaultValues, form]);

  const handleAddAvailability = () => {
    if (!day || !timeSlot) return;

    setAvailabilitySlots(prev => ({
      ...prev,
      [day]: timeSlot
    }));
    
    setDay("");
    setTimeSlot("");
  };

  const handleRemoveAvailability = (selectedDay: string) => {
    const updatedSlots = { ...availabilitySlots };
    delete updatedSlots[selectedDay];
    setAvailabilitySlots(updatedSlots);
  };

  const handleFormSubmit = (data: VolunteerFormValues) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...data,
        availabilitySlots,
      };
      onSubmit(formattedData);
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting the form",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium">Personal Information</h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (XXX) XXX-XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Name, relationship, phone number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Example: Jane Smith, Sister, +1 (XXX) XXX-XXXX
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium">Volunteer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
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
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-medium">Availability</h4>
              <Card>
                <CardHeader>
                  <div className="text-sm text-muted-foreground">
                    Add your available time slots
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Day</label>
                      <Select value={day} onValueChange={setDay}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOfWeek.map((day) => (
                            <SelectItem key={day.id} value={day.id}>
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Time</label>
                      <Select value={timeSlot} onValueChange={setTimeSlot}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time.id} value={time.id}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={handleAddAvailability}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Time Slot
                    </Button>
                  </div>
                  
                  {Object.keys(availabilitySlots).length > 0 ? (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Added Availability</h5>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(availabilitySlots).map(([day, time]) => {
                          const dayLabel = daysOfWeek.find(d => d.id === day)?.label || day;
                          const timeLabel = timeOptions.find(t => t.id === time)?.label || time;
                          
                          return (
                            <div 
                              key={day} 
                              className="flex items-center justify-between p-2 bg-muted rounded-md"
                            >
                              <span className="text-sm">
                                {dayLabel}: {timeLabel}
                              </span>
                              <Button 
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => handleRemoveAvailability(day)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No availability added yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <FormField
              control={form.control}
              name="skills"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Skills</FormLabel>
                    <FormDescription>
                      Select all skills that apply
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {skillOptions.map((skill) => (
                      <FormField
                        key={skill.id}
                        control={form.control}
                        name="skills"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={skill.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(skill.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, skill.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== skill.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {skill.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information about the volunteer"
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-hwf-purple hover:bg-hwf-purple-dark"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Volunteer" : "Add Volunteer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
