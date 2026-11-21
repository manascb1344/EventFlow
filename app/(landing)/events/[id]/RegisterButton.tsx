'use client';

interface RegisterButtonProps {
  eventId: number;
  seatsAvailable: number;
  eventStatus: string;
  registrationBlockedReason?: string;
}

export default function RegisterButton({
  eventId,
  seatsAvailable,
  eventStatus,
  registrationBlockedReason,
}: RegisterButtonProps) {
  const soldOut = seatsAvailable <= 0;
  const completed = eventStatus === 'COMPLETED';
  const disabled = Boolean(registrationBlockedReason) || soldOut || completed;

  const handleRegister = async () => {
    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <button
      onClick={handleRegister}
      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
        !disabled
          ? "bg-p1 text-[#05121a] hover:bg-[#7bf6ff] font-semibold"
          : "bg-gray-800 text-gray-400 cursor-not-allowed"
      }`}
      disabled={disabled}
    >
      {registrationBlockedReason ? (
        registrationBlockedReason
      ) : completed ? (
        "Event Completed"
      ) : soldOut ? (
        "Sold Out"
      ) : (
        <>
          Register Now
          <span className="block text-sm text-indigo-200/80">
            {seatsAvailable} spots remaining
          </span>
        </>
      )}
    </button>
  );
}
