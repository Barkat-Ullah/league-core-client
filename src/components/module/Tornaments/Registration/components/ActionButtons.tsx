import { useRouter } from "next/navigation";

interface ActionButtonsProps {
  currentStep: number;
  onBack: () => void;
  onNext: () => void;
  disabled?: boolean;
}

export default function ActionButtons({
  currentStep,
  onBack,
  onNext,
  disabled = false,
}: ActionButtonsProps) {
  const router = useRouter();

  if (currentStep < 4) {
    return (
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
        <button
          onClick={onBack}
          disabled={disabled}
          className="w-full sm:w-auto px-4 sm:px-8 py-3 border-2 border-gray-600 text-white font-bold rounded hover:border-gray-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={disabled}
          className="w-full sm:w-auto px-4 sm:px-8 py-3 bg-[#CCFF00] text-black font-bold rounded hover:bg-[#B8E600] transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {disabled ? "Processing..." : "Next"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
      <button
        onClick={() => router.push("/")}
        className="w-full sm:w-auto px-4 sm:px-8 py-3 border-2 border-[#CCFF00] text-[#CCFF00] font-bold rounded hover:bg-[#CCFF00] hover:text-black transition"
      >
        Continue
      </button>
      <button
        onClick={() => router.push("/dashboard/coach/tournament")}
        className="w-full sm:w-auto px-4 sm:px-8 py-3 bg-[#CCFF00] text-black font-bold rounded hover:bg-[#B8E600] transition"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
