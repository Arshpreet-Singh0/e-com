import { VerifyContent } from "@/components/payment/VerifyContent";
import { Suspense } from "react";

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex py-10 min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Loading...</h1>
          </div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
