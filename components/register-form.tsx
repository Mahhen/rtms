"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {PhoneInput} from "@/components/ui/phone-input";
import {CircleCheckBig} from "lucide-react";
import { useState } from "react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [OTPVisible, setOTPVisible] = useState<boolean>(false);
  return (
      <Dialog>
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Start your journey</CardTitle>
              <CardDescription>
                Now with us
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid gap-6">
                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  </div>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-3">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            required
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <PhoneInput
                              id="phone"
                              defaultCountry="IN"
                              maxLength={10}
                              required
                          />
                        </div>
                        <div className="flex-none">
                          <DialogTrigger>
                            <Button variant="secondary" size="icon" className="ml-auto size-8" onClick={() => setOTPVisible(false)}>
                              <CircleCheckBig />
                            </Button>
                          </DialogTrigger>
                        </div>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>OTP Verification</DialogTitle>
                            <DialogDescription>
                             Enter OTP
                            </DialogDescription>
                          </DialogHeader>
                          <InputOTP maxLength={6}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                              <InputOTPSlot index={1} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                              <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                              <InputOTPSlot index={3} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                              <InputOTPSlot index={4} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Verify</Button>
                          </DialogFooter>
                        </DialogContent>
                        {/* TODO: OTP field & all related functionalities */}
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                      />
                    </div>
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
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </Dialog>
  )
}
