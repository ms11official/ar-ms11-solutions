import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  itemId: string;
  itemType: "notes" | "prompts" | "mindmaps";
  amount: number;
  itemName: string;
  onSuccess?: () => void;
  onFailure?: (error: string) => void;
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async ({
  itemId,
  itemType,
  amount,
  itemName,
  onSuccess,
  onFailure,
}: RazorpayOptions) => {
  try {
    // Load Razorpay script
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error("Failed to load payment gateway");
    }

    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Please login to make a purchase");
    }

    // Create order
    const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
      body: { itemId, itemType, amount },
    });

    if (error) throw error;
    if (!data?.orderId) throw new Error("Failed to create order");

    // Initialize Razorpay
    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "WavexFlow",
      description: `Purchase: ${itemName}`,
      order_id: data.orderId,
      handler: async function (response: any) {
        try {
          // Verify payment
          const { error: verifyError } = await supabase.functions.invoke(
            "verify-razorpay-payment",
            {
              body: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
            }
          );

          if (verifyError) throw verifyError;

          toast.success("Payment successful! You can now access your purchase.");
          onSuccess?.();
        } catch (err: any) {
          toast.error(err.message || "Payment verification failed");
          onFailure?.(err.message);
        }
      },
      prefill: {
        email: session.user.email,
      },
      theme: {
        color: "#6366f1",
      },
      modal: {
        ondismiss: function () {
          toast.info("Payment cancelled");
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error: any) {
    toast.error(error.message || "Failed to initiate payment");
    onFailure?.(error.message);
  }
};
