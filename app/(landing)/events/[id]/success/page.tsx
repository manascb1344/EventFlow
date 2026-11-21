import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { processPayment } from "../actions";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id: string; demo?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/attendee/signin");
  }

  const { id } = await params;
  const { session_id, demo } = await searchParams;
  if (!session_id) {
    redirect(`/events/${id}`);
  }

  const result = await processPayment(session_id, id);
  
  if (!result.success) {
    redirect(`/events/${id}?error=${result.error}`);
  }

  if (!result.event || !result.ticket) {
    redirect(`/events/${id}?error=Ticket+not+found`);
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-lg border border-gray-800 p-8 text-center">
        <div className="mb-6">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          {demo === "1" ? "Demo Registration Confirmed" : "Payment Successful!"}
        </h1>
        <p className="text-gray-400 mb-6">
          {demo === "1"
            ? `Your demo ticket for ${result.event.name} is confirmed. No payment was taken.`
            : `Thank you for registering for ${result.event.name}. Your ticket has been confirmed.`}
        </p>
        <div className="space-y-4">
          <Link
            href="/dashboard/attendee/my-tickets"
            className="block w-full py-3 px-4 rounded-md font-semibold bg-p1 text-[#05121a] hover:bg-[#7bf6ff] transition-colors"
          >
            View My Tickets
          </Link>
          <Link
            href="/events"
            className="block w-full py-3 px-4 rounded-lg font-medium border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all duration-200"
          >
            Browse More Events
          </Link>
        </div>
      </div>
    </div>
  );
}
