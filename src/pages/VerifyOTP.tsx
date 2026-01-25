import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
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
      const { error } = await supabase.functions.invoke("send-otp", {
        body: { email, otp: newOtp, fullName },
      });

      if (!error) {
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
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <img src={logo} alt="WavexFlow" className="h-12 w-12" />
            <span className="text-2xl font-bold">WavexFlow</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Verify Your Email
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            We've sent a verification code to your email. Please enter it below to complete your registration.
          </p>
          <div className="mt-12">
            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Check your inbox</p>
                <p className="text-sm text-white/70">{email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <img src={logo} alt="WavexFlow" className="h-10 w-10" />
            <span className="text-xl font-bold text-foreground">WavexFlow</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Enter Verification Code</h1>
            <p className="text-muted-foreground">
              We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-foreground">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                maxLength={6}
                className="text-center text-2xl tracking-widest h-14 bg-background border-border"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Didn't receive the code? </span>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={!canResend || resendLoading}
                className="text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? "Sending..." : canResend ? "Resend Code" : `Resend in ${timer}s`}
              </button>
            </div>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/signup")}
                className="text-muted-foreground"
              >
                ← Back to Sign Up
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
