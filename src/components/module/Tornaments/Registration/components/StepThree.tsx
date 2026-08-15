"use client";

import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { Check, Copy, Loader } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export type PaymentMethod = "stripe" | "bundle";

interface StepThreeProps {
  tournamentName: string;
  tournamentDate: string;
  tournamentLocation: string;

  divisionId: string;
  divisionName: string;

  teamName: string;
  entryFee: string;

  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;

  onStripeCompleteChange: (complete: boolean) => void;
  isProcessing: boolean;
}

const DEMO_CARD = {
  number: "4242 4242 4242 4242",
  expiry: "06/33",
  cvc: "667",
};

export default function StepThree({
  tournamentName,
  tournamentDate,
  tournamentLocation,
  divisionId,
  divisionName,
  teamName,
  entryFee,
  paymentMethod,
  onPaymentMethodChange,
  onStripeCompleteChange,
  isProcessing,
}: StepThreeProps) {
  const numericEntryFee = useMemo(() => {
    const parsed = Number(entryFee.replace(/[^0-9.]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }, [entryFee]);

  const processingFee = useMemo(
    () => numericEntryFee * 0.03,
    [numericEntryFee],
  );
  const totalFee = useMemo(
    () => numericEntryFee + processingFee,
    [numericEntryFee, processingFee],
  );

  const formatUsd = (amount: number) => `$${amount.toFixed(2)}`;

  const [cardOk, setCardOk] = useState(false);
  const [expOk, setExpOk] = useState(false);
  const [cvcOk, setCvcOk] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (paymentMethod !== "stripe") {
      onStripeCompleteChange(true);
      return;
    }
    onStripeCompleteChange(Boolean(cardOk && expOk && cvcOk));
  }, [paymentMethod, cardOk, expOk, cvcOk, onStripeCompleteChange]);

  const stripeElementBase =
    "w-full bg-gray-900 text-white border border-gray-700 rounded px-3 sm:px-4 py-2.5 sm:py-3 focus-within:border-[#CCFF00] transition";

  const stripeOptions = useMemo(
    () =>
      ({
        style: {
          base: {
            color: "#ffffff",
            fontSize: "16px",
            "::placeholder": { color: "#4b5563" },
          },
          invalid: { color: "#f87171" },
        },
      }) as const,
    [],
  );

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text.replace(/\s/g, ""));
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {
      // fallback for older browsers
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    }
  };

  return (
    <div className="">
      <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-8 uppercase tracking-wide font-['Oswald']">
        Payment Information
      </h2>

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
        {isProcessing ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-md bg-black/60 backdrop-blur-[1px]">
            <div className="flex items-center gap-2 text-sm font-semibold text-white px-4 text-center">
              <Loader className="h-5 w-5 animate-spin text-[#CCFF00] shrink-0" />
              Processing payment...
            </div>
          </div>
        ) : null}

        {/* Summary */}
        <div className="border border-[#CCFF00] p-4 sm:p-5 rounded-md bg-[#2B3017] order-2 lg:order-1">
          <h3 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6 uppercase tracking-wide">
            Summary
          </h3>

          <div className="space-y-3 text-sm text-gray-300">
            <div>
              <p className="text-gray-400">Tournament:</p>
              <p className="text-white font-semibold wrap-break-word">
                {tournamentName}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Date:</p>
              <p className="text-white font-semibold">{tournamentDate}</p>
            </div>

            <div>
              <p className="text-gray-400">Location:</p>
              <p className="text-white font-semibold wrap-break-word">
                {tournamentLocation}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Division:</p>
              <p className="text-white font-semibold">
                {divisionName}
                {divisionId ? (
                  <span className="text-gray-400 font-normal">
                    {" "}
                    ({divisionId})
                  </span>
                ) : null}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Team:</p>
              <p className="text-white font-semibold wrap-break-word">{teamName}</p>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <p className="text-gray-400">Entry Fee:</p>
              <p className="text-white font-semibold">{entryFee}</p>
            </div>

            <div>
              <p className="text-gray-400">Processing:</p>
              <p className="text-white font-semibold">
                3% ({formatUsd(processingFee)})
              </p>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <p className="text-gray-400">Total:</p>
              <p className="text-white font-bold text-lg">
                {formatUsd(totalFee)}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-gray-400">
            Processing fees are applied at checkout (3% of entry fee).
          </p>
        </div>

        {/* Payment Method */}
        <div className="border border-[#CCFF00] p-4 sm:p-5 rounded-md bg-[#2B3017] order-1 lg:order-2">
          <h3 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6 uppercase tracking-wide">
            Payment Method
          </h3>

          <div className="flex flex-wrap gap-3 sm:gap-4 mb-5 sm:mb-6">
            <button
              type="button"
              onClick={() => onPaymentMethodChange("stripe")}
              className={`flex items-center justify-center px-4 h-11 sm:h-12 rounded border-2 transition text-sm font-semibold ${
                paymentMethod === "stripe"
                  ? "border-[#CCFF00] bg-gray-900 text-white"
                  : "border-gray-700 bg-gray-900 hover:border-gray-600 text-gray-200"
              }`}
            >
              💳 Stripe
            </button>

            {/* Demo button */}
            {paymentMethod === "stripe" && (
              <button
                type="button"
                onClick={() => setShowDemo((v) => !v)}
                className="flex items-center justify-center px-4 h-11 sm:h-12 rounded border-2 border-dashed border-gray-600 bg-gray-900/60 hover:border-[#CCFF00] hover:text-[#CCFF00] transition text-sm font-semibold text-gray-300"
              >
                🧪 Demo
              </button>
            )}
          </div>

          {/* Demo card helper panel */}
          {paymentMethod === "stripe" && showDemo && (
            <div className="mb-5 rounded-lg border border-[#CCFF00]/40 bg-gray-900/80 p-3 sm:p-4 space-y-2.5">
              <p className="text-xs sm:text-sm text-[#CCFF00] font-semibold">
                Stripe test card (copy & paste into the fields below)
              </p>

              {[
                {
                  label: "Card Number",
                  value: DEMO_CARD.number,
                  field: "number",
                },
                { label: "Expiry", value: DEMO_CARD.expiry, field: "expiry" },
                { label: "CVC", value: DEMO_CARD.cvc, field: "cvc" },
              ].map((item) => (
                <div
                  key={item.field}
                  className="flex items-center justify-between gap-2 rounded bg-gray-800/80 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-400">{item.label}</p>
                    <p className="text-sm text-white font-mono tracking-wide">
                      {item.value}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.value, item.field)}
                    className="shrink-0 p-1.5 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition"
                    title="Copy"
                  >
                    {copiedField === item.field ? (
                      <Check size={16} className="text-[#CCFF00]" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              ))}

              <p className="text-[11px] text-gray-500">
                Stripe does not allow auto-fill for security. Paste each value
                into the matching field.
              </p>
            </div>
          )}

          {paymentMethod === "stripe" && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2 sm:mb-3 font-semibold">
                  Card Number
                </label>
                <div className={stripeElementBase}>
                  <CardNumberElement
                    options={stripeOptions}
                    onChange={(e) => setCardOk(Boolean(e.complete))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2 sm:mb-3 font-semibold">
                    Expiration Date
                  </label>
                  <div className={stripeElementBase}>
                    <CardExpiryElement
                      options={stripeOptions}
                      onChange={(e) => setExpOk(Boolean(e.complete))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2 sm:mb-3 font-semibold">
                    CVC
                  </label>
                  <div className={stripeElementBase}>
                    <CardCvcElement
                      options={stripeOptions}
                      onChange={(e) => setCvcOk(Boolean(e.complete))}
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400">
                Your card details are securely handled by Stripe.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
