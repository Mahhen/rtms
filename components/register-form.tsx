"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { CircleCheckBig } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // ✅ Send OTP
  const sendOtp = async () => {
    if (!email) return alert("Enter email first!");

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: newOtp }),
      });

      if (res.ok) {
        setDialogOpen(true);
        alert("OTP sent ✅");
      } else {
        alert("Failed to send OTP ❌");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      alert("Error sending OTP ❌");
    }
  };

  // ✅ Verify OTP
  const verifyOtp = () => {
    if (otp === generatedOtp) {
      alert("Email verified 🎉");
      setDialogOpen(false);
    } else {
      alert("Invalid OTP ❌");
    }
  };

  // ✅ Register API Call
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      firstName: { value: string };
      lastName: { value: string };
      phone: { value: string };
      password: { value: string };
      confirmPassword: { value: string };
    };

    const firstName = target.firstName.value;
    const lastName = target.lastName.value;
    const phone = target.phone.value;
    const password = target.password.value;
    const confirmPassword = target.confirmPassword.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
      } else {
        alert(data.message || "Failed to register ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Start your journey</CardTitle>
            <CardDescription>Now with us</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                {/* First + Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-3">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" type="text" placeholder="John" required />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" type="text" placeholder="Doe" required />
                  </div>
                </div>

                {/* Email */}
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={sendOtp}
                    >
                      <CircleCheckBig />
                    </Button>
                  </div>
                </div>

                {/* Phone */}
                <div className="grid gap-3">
                  <Label htmlFor="phone">Phone</Label>
                  <PhoneInput id="phone" defaultCountry="IN" required />
                </div>

                {/* Passwords */}
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" required />
                </div>

                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Log In
                </a>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-muted-foreground text-center text-xs">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </div>
      </div>

      {/* OTP Dialog */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>OTP Verification</DialogTitle>
          <DialogDescription>Enter the OTP sent to your email</DialogDescription>
        </DialogHeader>

        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          {[...Array(6)].map((_, i) => (
            <InputOTPGroup key={i}>
              <InputOTPSlot index={i} />
            </InputOTPGroup>
          ))}
        </InputOTP>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={verifyOtp}>Verify</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
