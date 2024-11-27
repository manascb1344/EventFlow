'use client';

import { useState, useEffect } from 'react';
import { getAttendeeProfile, updateAttendeeProfile } from './actions';
import { DashboardShell } from '@/components/shell';
import { DashboardHeader } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface AttendeeProfile {
  id: number;
  name: string | null;
  phoneNumber: string | null;
  interests: string | null;
  dietaryRestrictions: string | null;
  preferredPaymentMethod: string | null;
  notificationPreferences: boolean | null;
  profileImage: string | null;
}

export default function AttendeeProfilePage() {
  const { data: session } = useSession();
  const [attendee, setAttendee] = useState<AttendeeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (session?.user?.id) {
        try {
          const profile = await getAttendeeProfile(Number(session.user.id));
          setAttendee(profile);
        } catch (error) {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile');
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchProfile();
  }, [session]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsSaving(true);
    try {
      await updateAttendeeProfile(Number(session?.user?.id), formData);
      toast.success('Profile updated successfully');
      const profile = await getAttendeeProfile(Number(session?.user?.id));
      setAttendee(profile);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <DashboardHeader
          heading="Profile Settings"
          text="Manage your attendee profile and preferences"
        />
        
        <Card className="border-white/10 bg-black-100/40 backdrop-blur-xl">
          <CardHeader className="border-b border-white/10 pb-4">
            <CardTitle className="text-p1 font-semibold">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="name" className="text-p4 font-medium">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={attendee?.name ?? ''}
                    placeholder="Enter your full name"
                    className="h-12 bg-s2/50 backdrop-blur-sm border-white/10 text-white placeholder:text-s3 focus:border-p1/50 hover:border-white/20 transition-colors"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="phoneNumber" className="text-p4 font-medium">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    defaultValue={attendee?.phoneNumber ?? ''}
                    placeholder="Enter your phone number"
                    className="h-12 bg-s2/50 backdrop-blur-sm border-white/10 text-white placeholder:text-s3 focus:border-p1/50 hover:border-white/20 transition-colors"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="interests" className="text-p4 font-medium">Interests</Label>
                  <Textarea
                    id="interests"
                    name="interests"
                    defaultValue={attendee?.interests ?? ''}
                    placeholder="What kind of events interest you?"
                    className="min-h-[120px] bg-s2/50 backdrop-blur-sm border-white/10 text-white placeholder:text-s3 focus:border-p1/50 hover:border-white/20 transition-colors resize-none"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="dietaryRestrictions" className="text-p4 font-medium">Dietary Restrictions</Label>
                  <Textarea
                    id="dietaryRestrictions"
                    name="dietaryRestrictions"
                    defaultValue={attendee?.dietaryRestrictions ?? ''}
                    placeholder="Any dietary restrictions we should know about?"
                    className="min-h-[120px] bg-s2/50 backdrop-blur-sm border-white/10 text-white placeholder:text-s3 focus:border-p1/50 hover:border-white/20 transition-colors resize-none"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="preferredPaymentMethod" className="text-p4 font-medium">Preferred Payment Method</Label>
                  <Select name="preferredPaymentMethod" defaultValue={attendee?.preferredPaymentMethod ?? ''}>
                    <SelectTrigger className="h-12 bg-s2/50 backdrop-blur-sm border-white/10 text-white hover:border-white/20 focus:border-p1/50">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent className="bg-s2 border-white/10">
                      <SelectItem value="card" className="text-p4 focus:bg-s3/50">Credit/Debit Card</SelectItem>
                      <SelectItem value="bank" className="text-p4 focus:bg-s3/50">Bank Transfer</SelectItem>
                      <SelectItem value="wallet" className="text-p4 focus:bg-s3/50">Digital Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="notificationPreferences" className="text-p4 font-medium">Email Notifications</Label>
                  <Switch
                    id="notificationPreferences"
                    name="notificationPreferences"
                    defaultChecked={attendee?.notificationPreferences ?? false}
                    className="data-[state=checked]:bg-p1 border-white/50"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="profileImage" className="text-p4 font-medium">Profile Image URL</Label>
                  <Input
                    id="profileImage"
                    name="profileImage"
                    defaultValue={attendee?.profileImage ?? ''}
                    placeholder="Enter profile image URL"
                    className="h-12 bg-s2/50 backdrop-blur-sm border-white/10 text-white placeholder:text-s3 focus:border-p1/50 hover:border-white/20 transition-colors"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
