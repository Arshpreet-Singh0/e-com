"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/config/config";
import axios from "axios";
import { toast } from "sonner";

export function VerifyContent() {
  const [status, setStatus] = useState<"verifying" | "success" | "failed">(
    "verifying"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const verifyRazorpayPayment = async () => {
      try {
        const paymentId = searchParams.get("razorpay_payment_id");
        const orderId = searchParams.get("order_id");
        const razorpay_order_id = searchParams.get("razorpay_order_id");
        const signature = searchParams.get("razorpay_signature");
        const amount = searchParams.get("amount"); // Get amount from URL

        // if (!paymentId || !orderId || !signature) {
        //   throw new Error("Missing payment parameters");
        // }

        // Verify with Razorpay endpoint with all required fields

            const response = await axios.post(`${BACKEND_URL}/api/v1/payment/verify`,{
                orderId,
                paymentId,
                signature,
                amount,
                razorpay_order_id
            } , {
                withCredentials: true,
            });
            
            if(response.data.status === "SUCCESS"){
                router.push("/payment/success");

            }
              // Show success toast
              toast.success(
                "Payment Verified"
              );
    
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("failed");
        setErrorMessage("Payment verification failed");
        setTimeout(() => {
          router.push("/payment/cancel");
        }, 2000);
      }
    };

    verifyRazorpayPayment();
  }, [searchParams, router]);

  if (status === "verifying") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90">
        <div
          className="text-center space-y-6 max-w-md mx-auto px-4"
        >
          <div className="relative">
            <div
              className="w-20 h-20 mx-auto"
            >
              <div className="w-full h-full border-4 border-primary/30 border-t-primary rounded-full" />
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center"
            >
              <Shield className="w-8 h-8 text-primary/50" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Verifying Your Payment
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Please wait while we confirm your transaction. This will only take
              a moment.
            </p>
          </div>

          <div
          >
            <div className="p-4 rounded-2xl bg-secondary/30 backdrop-blur-sm">
              <Loader2 className="w-6 h-6 mx-auto mb-2 text-primary animate-spin" />
              <span className="text-sm font-medium">Checking</span>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/30 backdrop-blur-sm">
              <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Securing</span>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/30 backdrop-blur-sm">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Confirming</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90 p-6">
        <div
          className="max-w-xl w-full mx-auto"
        >
          <div className="relative bg-card/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-border/50">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <div
                className="relative bg-gradient-to-br from-red-500 to-rose-600 p-4 rounded-full shadow-lg"
              >
                <XCircle className="w-12 h-12 text-white" strokeWidth={2} />
              </div>
            </div>

            <div className="text-center space-y-6 mt-8">
              <div className="space-y-2">
                <h1
                
                  className="text-4xl font-bold text-red-500"
                >
                  Verification Failed
                </h1>
                <p
                >
                  {errorMessage}
                </p>
              </div>

              <div
              >
                <Button
                  onClick={() => router.push("/pricing")}
                  className="w-full py-6 text-base font-medium"
                >
                  Try Again
                  <RefreshCcw className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
