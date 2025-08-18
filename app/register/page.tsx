import { RegisterForm } from "@/components/register-form"

export default function LoginPage() {
  return (
    <div className="dark bg-[url(/loginsplash2.jpg)] bg-cover flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
    <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <img src={"/logo.png"} width={32} height={32} />
            </div>
            RailBuddy.com
        </a>
        <RegisterForm />
    </div>
    </div>
  )
}