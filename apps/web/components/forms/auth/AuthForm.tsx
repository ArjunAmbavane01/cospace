"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useAuth from "hooks/useAuth";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Logo from "@/components/Logo";
import { toast } from "sonner";
import { ArrowLeft, Copy, Check } from "lucide-react";

interface AuthFormProps {
    mode: "signin" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {

    const router = useRouter();
    const [showCredentials, setShowCredentials] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const testCredentials = {
        email: "test@cospace.com",
        password: "TestPassword123"
    };

    const {
        loading: authLoading,
        loadingGoogle: googleAuthLoading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail
    } = useAuth();

    const handleGoogleAuth = async () => {
        try {
            await signInWithGoogle();
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Something went wrong")
        }
    };

    const handleCopy = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            toast.success(`${field} copied to clipboard`);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            toast.error("Failed to copy");
        }
    };

    return (
        <div className='flex justify-center items-center h-screen w-full bg-background'>
            <div className="grid grid-cols-3 gap-3 p-3 rounded-lg border w-full max-w-7xl mx-auto relative">
                <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => router.push("/")}
                    className="absolute top-3 left-3 group"
                >
                    <div className="w-0 group-hover:w-4 transition-all overflow-hidden">
                        <ArrowLeft />
                    </div>
                    <span>Go Back</span>
                </Button>
                <div className="col-span-1 flex flex-col justify-center items-center gap-6 p-10 h-[550px] w-full rounded-lg">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <Logo />
                        <h2>
                            {
                                mode === "signup" ?
                                    "Create your CoSpace account" :
                                    "Welcome back to CoSpace"
                            }
                        </h2>
                    </div>
                    {mode === "signup" ?
                        <SignUpForm authLoading={authLoading} googleAuthLoading={googleAuthLoading} signUpWithEmail={signUpWithEmail} /> :
                        <SignInForm authLoading={authLoading} googleAuthLoading={googleAuthLoading} signInWithEmail={signInWithEmail} />
                    }
                    <div className="w-full flex flex-col gap-5">
                        <Separator className="my-2 relative">
                            <h6 className="text-muted-foreground bg-background px-3 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                                OR
                            </h6>
                        </Separator>
                        <Button
                            onClick={handleGoogleAuth}
                            variant={"outline"}
                            size={"lg"}
                            disabled={authLoading}
                            className="w-full"
                        >
                            <Image src={"/assets/logo/google-logo.svg"} alt={"Google logo"} width={20} height={20} className="size-4" />
                            {googleAuthLoading ? <Spinner /> : "Google"}
                        </Button>
                        {mode === "signin" &&
                            <Button
                                onClick={() => setShowCredentials(true)}
                                variant={"outline"}
                                size={"lg"}
                                disabled={authLoading}
                                className="w-full text-muted-foreground"
                            >
                                Test Credentials
                            </Button>
                        }
                    </div>
                </div>
                <div className="col-span-2 size-full border rounded-lg relative overflow-hidden">
                    <Image src={"/assets/forest.jpg"} alt="forest image" fill className="object-cover rounded-lg" />
                </div>
            </div>

            <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Test Credentials</DialogTitle>
                        <DialogDescription>
                            Use these credentials to test the application
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Email
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 px-3 py-2 bg-muted rounded-md text-sm font-mono">
                                    {testCredentials.email}
                                </div>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleCopy(testCredentials.email, "Email")}
                                    className="relative"
                                >
                                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${copiedField === "Email" ? "scale-100 opacity-100" : "scale-50 opacity-0"
                                        }`}>
                                        <Check className="h-4 w-4 text-green-500" />
                                    </div>
                                    <div className={`transition-all duration-300 ${copiedField === "Email" ? "scale-50 opacity-0" : "scale-100 opacity-100"
                                        }`}>
                                        <Copy className="h-4 w-4" />
                                    </div>
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Password
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 px-3 py-2 bg-muted rounded-md text-sm font-mono">
                                    {testCredentials.password}
                                </div>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleCopy(testCredentials.password, "Password")}
                                    className="relative"
                                >
                                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${copiedField === "Password" ? "scale-100 opacity-100" : "scale-50 opacity-0"
                                        }`}>
                                        <Check className="h-4 w-4 text-green-500" />
                                    </div>
                                    <div className={`transition-all duration-300 ${copiedField === "Password" ? "scale-50 opacity-0" : "scale-100 opacity-100"
                                        }`}>
                                        <Copy className="h-4 w-4" />
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}
