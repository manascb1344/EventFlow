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
import Image from "next/image";
import { UploadDropzone } from "@uploadthing/react";
import { UploadRouter } from "@/app/api/uploadthing/core";

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
                    type="tel"
                    pattern="[+]?[0-9 ()-]{7,20}"
                    title="Use digits, spaces, +, () or -"
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
                  <Label htmlFor="profileImage" className="text-p4 font-medium">Profile Image</Label>
                  <div className="space-y-4">
                    {attendee?.profileImage && (
                      <div className="relative w-32 h-32 rounded-full overflow-hidden">
                        <Image
                          src={attendee.profileImage}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <UploadDropzone<UploadRouter, "strictImageAttachment">
                      endpoint="strictImageAttachment"
                      onClientUploadComplete={async (res) => {
                        if (res?.[0]) {
                          // Update local state
                          setAttendee((prev) => ({
                            ...prev!,
                            profileImage: res[0].url
                          }));
                          
                          // Update database with all existing data
                          const formData = new FormData();
                          formData.set('name', attendee?.name || '');
                          formData.set('phoneNumber', attendee?.phoneNumber || '');
                          formData.set('interests', attendee?.interests || '');
                          formData.set('dietaryRestrictions', attendee?.dietaryRestrictions || '');
                          formData.set('preferredPaymentMethod', attendee?.preferredPaymentMethod || '');
                          formData.set('notificationPreferences', String(attendee?.notificationPreferences || false));
                          formData.set('profileImage', res[0].url);
                          await updateAttendeeProfile(attendee?.id, formData);
                        }
                      }}
                      onUploadError={(error: Error) => {
                        console.error("Profile image upload error:", error);
                      }}
                      config={{ mode: "auto" }}
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-p1 text-[#05121a] hover:bg-[#7bf6ff] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
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
