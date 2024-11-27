'use client';

import { useSession } from "next-auth/react";
import { redirect, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { toast } from "sonner";
import { updateEvent } from "../../../_actions/events";
import { getEvent } from "../../../_actions/getEvent";

const eventFormSchema = z.object({
  name: z.string().min(2, {
    message: "Event name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  ticketPrice: z.string().transform((val) => parseFloat(val)),
  seatsAvailable: z.string().transform((val) => parseInt(val)),
  venue: z.string().min(2, {
    message: "Venue must be at least 2 characters.",
  }),
  venueCapacity: z.string().transform((val) => parseInt(val)),
  isPublic: z.boolean().default(true),
  registrationDeadline: z.string(),
});

export default function EditEventPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const eventId = parseInt(params.id as string);

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const result = await getEvent(eventId);
        
        if (result.error) {
          toast.error(result.error);
          return;
        }

        // Format dates for the form
        const startDate = new Date(result.event.startDate);
        const endDate = new Date(result.event.endDate);
        const registrationDeadline = new Date(result.event.registrationDeadline);

        form.reset({
          ...result.event,
          startDate: format(startDate, "yyyy-MM-dd'T'HH:mm"),
          endDate: format(endDate, "yyyy-MM-dd'T'HH:mm"),
          registrationDeadline: format(registrationDeadline, "yyyy-MM-dd'T'HH:mm"),
          ticketPrice: result.event.ticketPrice.toString(),
          seatsAvailable: result.event.seatsAvailable.toString(),
          venueCapacity: result.event.venueCapacity.toString(),
        });
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchEvent();
    }
  }, [session?.user?.id, eventId, form]);

  if (status === "unauthenticated") {
    redirect("/auth/organizer/signin");
  }

  if (session?.user?.role !== "ORGANIZER") {
    redirect("/");
  }

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      const result = await updateEvent(eventId, formData);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Event updated successfully');
      router.push(`/dashboard/organizer/events/${eventId}`);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error('Failed to update event');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading event details...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Edit Event</h2>
        <p className="text-white">
          Make changes to your event details below.
        </p>
      </div>

      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="text-white">Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Event Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Tech Conference 2024" {...field} className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors" />
                      </FormControl>
                      <FormMessage className="text-white" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Location</FormLabel>
                      <FormControl>
                        <Input placeholder="San Francisco, CA" {...field} className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors" />
                      </FormControl>
                      <FormMessage className="text-white" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Start Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors" />
                      </FormControl>
                      <FormMessage className="text-white" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">End Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors" />
                      </FormControl>
                      <FormMessage className="text-white" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Venue</FormLabel>
                      <FormControl>
                        <Input placeholder="Moscone Center" {...field} className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors" />
                      </FormControl>
                      <FormMessage className="text-white" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="venueCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Venue Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" {...field} className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors" />
                      </FormControl>
                      <FormMessage className="text-white" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ticketPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Ticket Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="99.99" {...field} className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors" />
                      </FormControl>
                      <FormMessage className="text-white" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seatsAvailable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Available Seats</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="200" {...field} className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors" />
                      </FormControl>
                      <FormMessage className="text-white" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationDeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Registration Deadline</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} className="bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors" />
                      </FormControl>
                      <FormMessage className="text-white" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter event description..."
                        className="min-h-[100px] bg-transparent backdrop-blur-sm border border-white/30 text-white placeholder:text-gray-400 focus:border-white/50 hover:border-white/40 transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-white" />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-accent/20 text-white"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="text-white">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
