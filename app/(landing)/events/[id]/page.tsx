import { notFound } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getEventById } from "../actions";
import RegisterButton from "./RegisterButton";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const registrationBlockedReason = !session
    ? "Sign in to register"
    : session.user.role !== "ATTENDEE"
      ? "Sign in with an attendee account to register"
      : undefined;

  return (
    <div className="relative min-h-screen">
      {/* Banner Image */}
      <div className="absolute inset-0 h-[50vh] overflow-hidden">
        {event.bannerImage ? (
          <>
            <Image
              src={event.bannerImage}
              alt={event.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-950/30 via-gray-950/80 to-gray-950" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950" />
        )}
      </div>

      {/* Content */}
      <div className="relative">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="min-h-[50vh] flex items-end pb-16">
            <div className="w-full max-w-4xl">
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  event.eventStatus === 'SCHEDULED' ? 'bg-indigo-500/20 text-indigo-300' :
                  event.eventStatus === 'ONGOING' ? 'bg-green-500/20 text-green-300' :
                  event.eventStatus === 'COMPLETED' ? 'bg-gray-500/20 text-gray-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {event.eventStatus}
                </span>
                {!event.isPublic && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                    Private Event
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{event.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-300">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {format(event.startDate, "PPP")}
                </span>
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-3 gap-8 pb-16">
            <div className="md:col-span-2">
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-lg border border-gray-800 p-8 space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-white">About this event</h2>
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{event.description}</p>
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <h2 className="text-2xl font-semibold mb-4 text-white">Event Schedule</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-500/10 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-200">Start Time</p>
                        <p className="text-gray-400">{format(event.startDate, "p, PPP")}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-500/10 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-200">End Time</p>
                        <p className="text-gray-400">{format(event.endDate, "p, PPP")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <h2 className="text-2xl font-semibold mb-4 text-white">Venue Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-gray-400">Venue Name</p>
                      <p className="text-gray-200 font-medium">{event.venue || 'To be announced'}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400">Venue Capacity</p>
                      <p className="text-gray-200 font-medium">{event.venueCapacity || 'Not specified'} people</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400">Registration Deadline</p>
                      <p className="text-gray-200 font-medium">
                        {event.registrationDeadline
                          ? format(event.registrationDeadline, "PPP")
                          : 'Open until full'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400">Event Type</p>
                      <p className="text-gray-200 font-medium">{event.isPublic ? 'Public Event' : 'Private Event'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-lg border border-gray-800 p-6 h-full flex flex-col sticky top-8">
                <div className="text-center p-4 rounded-md border border-white/10 bg-white/5">
                  <p className="text-2xl font-bold text-white">₹{event.ticketPrice}</p>
                  <p className="text-gray-400">per ticket</p>
                </div>

                <div className="flex-grow space-y-4 my-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Available Seats</span>
                    <span className="font-semibold text-gray-200">{event.seatsAvailable}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Venue Capacity</span>
                    <span className="font-semibold text-gray-200">{event.venueCapacity || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Registration Closes</span>
                    <span className="font-semibold text-gray-200">
                      {event.registrationDeadline
                        ? format(event.registrationDeadline, "MMM d")
                        : 'Until full'}
                    </span>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <RegisterButton
                    eventId={event.id}
                    seatsAvailable={event.seatsAvailable}
                    eventStatus={event.eventStatus}
                    registrationBlockedReason={registrationBlockedReason}
                  />
                </div>

                <p className="text-xs text-center text-gray-500">
                  Secure checkout • Instant confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
