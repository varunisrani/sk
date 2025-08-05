import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DiscipleshipStageSelector } from './DiscipleshipStageSelector';
import { SpiritualGiftsSelector } from './SpiritualGiftsSelector';
import { PhotoUpload } from './PhotoUpload';
import type { Member, MemberFormData } from '@/types/member';

const memberFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone_number: z.string().optional(),
  birthday: z.date().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  discipleship_stage: z.enum(['New Believer', 'Growing', 'Mature', 'Leader', 'Seeker']).optional(),
  spiritual_gifts: z.array(z.string()).default([]),
  baptized: z.boolean().default(false),
  baptism_date: z.date().optional(),
  saved_status: z.boolean().default(false),
  salvation_date: z.date().optional(),
  biblical_understanding: z.enum(['Beginner', 'Basic', 'Intermediate', 'Advanced']).optional(),
  email_notifications: z.boolean().default(true),
  sms_notifications: z.boolean().default(false),
  language_preference: z.string().default('en'),
  photo_url: z.string().optional(),
});

interface MemberFormProps {
  initialData?: Partial<Member>;
  isEditing?: boolean;
  onSubmit: (data: MemberFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function MemberForm({ 
  initialData, 
  isEditing = false, 
  onSubmit, 
  onCancel,
  isLoading = false 
}: MemberFormProps) {
  const [activeTab, setActiveTab] = useState('personal');

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone_number: initialData?.phone_number || '',
      birthday: initialData?.birthday ? new Date(initialData.birthday) : undefined,
      address: initialData?.address || '',
      country: initialData?.country || '',
      city: initialData?.city || '',
      discipleship_stage: initialData?.discipleship_stage,
      spiritual_gifts: initialData?.spiritual_gifts || [],
      baptized: initialData?.baptized || false,
      baptism_date: initialData?.baptism_date ? new Date(initialData.baptism_date) : undefined,
      saved_status: initialData?.saved_status || false,
      salvation_date: initialData?.salvation_date ? new Date(initialData.salvation_date) : undefined,
      biblical_understanding: initialData?.biblical_understanding,
      email_notifications: initialData?.email_notifications ?? true,
      sms_notifications: initialData?.sms_notifications ?? false,
      language_preference: initialData?.language_preference || 'en',
      photo_url: initialData?.photo_url || '',
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

  const watchedFields = {
    baptized: watch('baptized'),
    saved_status: watch('saved_status'),
    birthday: watch('birthday'),
    baptism_date: watch('baptism_date'),
    salvation_date: watch('salvation_date'),
  };

  const handleFormSubmit = async (data: MemberFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const DatePicker = ({ 
    field, 
    placeholder, 
    disabled = false 
  }: { 
    field: keyof MemberFormData; 
    placeholder: string; 
    disabled?: boolean;
  }) => {
    const value = watchedFields[field as keyof typeof watchedFields] as Date | undefined;
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => setValue(field, date)}
            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="spiritual">Spiritual Journey</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PhotoUpload
                currentPhotoUrl={initialData?.photo_url}
                onPhotoChange={(url) => setValue('photo_url', url)}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name"
                    {...register('name')} 
                    placeholder="Enter full name"
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    {...register('email')} 
                    placeholder="email@example.com"
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input 
                    id="phone_number"
                    {...register('phone_number')} 
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Birthday</Label>
                  <DatePicker field="birthday" placeholder="Select birthday" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea 
                    id="address"
                    {...register('address')} 
                    placeholder="Street address"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city"
                    {...register('city')} 
                    placeholder="City"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country"
                    {...register('country')} 
                    placeholder="Country"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spiritual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spiritual Journey</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Discipleship Stage</Label>
                <select 
                  {...register('discipleship_stage')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select stage</option>
                  <option value="Seeker">Seeker</option>
                  <option value="New Believer">New Believer</option>
                  <option value="Growing">Growing</option>
                  <option value="Mature">Mature</option>
                  <option value="Leader">Leader</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Spiritual Gifts</Label>
                <SpiritualGiftsSelector
                  value={watch('spiritual_gifts') || []}
                  onChange={(gifts) => setValue('spiritual_gifts', gifts)}
                  maxSelections={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="saved_status"
                      checked={watchedFields.saved_status}
                      onCheckedChange={(checked) => setValue('saved_status', checked)}
                    />
                    <Label htmlFor="saved_status">Born Again/Saved</Label>
                  </div>
                  
                  {watchedFields.saved_status && (
                    <div className="space-y-2">
                      <Label>Salvation Date</Label>
                      <DatePicker field="salvation_date" placeholder="Select salvation date" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="baptized"
                      checked={watchedFields.baptized}
                      onCheckedChange={(checked) => setValue('baptized', checked)}
                    />
                    <Label htmlFor="baptized">Baptized</Label>
                  </div>
                  
                  {watchedFields.baptized && (
                    <div className="space-y-2">
                      <Label>Baptism Date</Label>
                      <DatePicker 
                        field="baptism_date" 
                        placeholder="Select baptism date"
                        disabled={!watchedFields.saved_status}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Biblical Understanding</Label>
                <select 
                  {...register('biblical_understanding')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Communication & Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Communication Preferences</h4>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="email_notifications"
                    checked={watch('email_notifications')}
                    onCheckedChange={(checked) => setValue('email_notifications', checked)}
                  />
                  <Label htmlFor="email_notifications">Email Notifications</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="sms_notifications"
                    checked={watch('sms_notifications')}
                    onCheckedChange={(checked) => setValue('sms_notifications', checked)}
                  />
                  <Label htmlFor="sms_notifications">SMS Notifications</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language_preference">Language Preference</Label>
                <select 
                  id="language_preference"
                  {...register('language_preference')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="pt">Portuguese</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Member' : 'Create Member'}
        </Button>
      </div>
    </form>
  );
}