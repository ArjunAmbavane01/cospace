"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import useAuth from "hooks/useAuth";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ArrowLeft, Users } from "lucide-react";
import { TbTopologyStar3 } from "react-icons/tb";

interface AuthFormProps {
    mode: "signin" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {

    const router = useRouter();
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
    }

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
                        <div className='flex items-center justify-center bg-blue-600 border rounded-lg size-10'>
                            <TbTopologyStar3 className='size-5' />
                        </div>
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
                    </div>
                </div>
                <div className="col-span-2 size-full border rounded-lg relative overflow-hidden">
                    <Image src={"/assets/forest.jpg"} alt="forest image" fill className="object-cover rounded-lg" />
                </div>
            </div>
        </div>
    )
}
