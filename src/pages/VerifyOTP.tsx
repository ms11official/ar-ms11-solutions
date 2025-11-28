import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import signupBg from "@/assets/signup-bg.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [currentStoredOtp, setCurrentStoredOtp] = useState(location.state?.storedOtp || "");
  const { email, password, fullName } = location.state || {};

  useEffect(() => {
    if (!email || !currentStoredOtp) {
      navigate("/signup");
    }
  }, [email, currentStoredOtp, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleResendOTP = async () => {
    setResendLoading(true);
    
    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email,
            otp: newOtp,
            fullName,
          }),
        }
      );

      if (response.ok) {
        setCurrentStoredOtp(newOtp);
        setTimer(60);
        setCanResend(false);
        setOtp("");
        toast({
          title: "Success",
          description: "New OTP sent to your email!",
        });
      } else {
        throw new Error("Failed to send OTP");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp !== currentStoredOtp) {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Create account after OTP verification
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1a2332]">
        <div className="absolute inset-0 flex flex-col justify-center px-16 text-white">
          <h2 className="text-2xl font-bold mb-4">AR-MS11</h2>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Verify Your Email
          </h1>
          <p className="text-lg text-slate-300">
            We've sent a verification code to your email.<br />
            Please enter it below to complete registration.
          </p>
        </div>
        <img 
          src={signupBg} 
          alt="Verify Email" 
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Verify OTP</h1>
            <p className="text-muted-foreground">
              Enter the 6-digit code sent to {email}
            </p>
          </div>

          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Didn't receive code? </span>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={!canResend || resendLoading}
                className="text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? "Sending..." : canResend ? "Resend OTP" : `Resend in ${timer}s`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
