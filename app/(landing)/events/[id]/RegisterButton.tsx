'use client';

interface RegisterButtonProps {
  eventId: number;
  seatsAvailable: number;
  eventStatus: string;
}

export default function RegisterButton({
  eventId,
  seatsAvailable,
  eventStatus,
}: RegisterButtonProps) {
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
        seatsAvailable > 0 && eventStatus !== 'COMPLETED'
          ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl hover:shadow-indigo-500/20"
          : "bg-gray-800 text-gray-400 cursor-not-allowed"
      }`}
      disabled={seatsAvailable <= 0 || eventStatus === 'COMPLETED'}
    >
      {seatsAvailable > 0 && eventStatus !== 'COMPLETED' ? (
        <>
          Register Now
          <span className="block text-sm text-indigo-200/80">
            {seatsAvailable} spots remaining
          </span>
        </>
      ) : (
        eventStatus === 'COMPLETED' ? "Event Completed" : "Sold Out"
      )}
    </button>
  );
}
