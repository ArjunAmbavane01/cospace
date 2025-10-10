"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/lib/auth/index";
import { Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";




export default function page() {

    const { loading, signInWithGoogle } = useAuth();
    return (
        <div className='flex justify-center items-center h-screen w-full bg-background p-20'>
            <div className="grid grid-cols-3 gap-3 p-3 rounded-lg border h-full w-full max-w-7xl mx-auto">
                <div className="col-span-1 flex flex-col justify-center items-center gap-8 px-8 w-full text-center rounded-lg">
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex justify-center items-center size-10 bg-accent rounded-lg">
                            <Users className="size-5" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <h2>
                                Create Your Account
                            </h2>
                            <h6 className="text-muted-foreground">
                                Step into your virtual office and collaborate in real time.
                            </h6>

                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-5 w-full">
                        <div className="space-y-3 w-full">
                            <Input placeholder="Enter your name" />
                            <Input placeholder="Enter your email" />
                        </div>
                        <div className="space-y-2 w-full">
                            <Button className="w-full">
                                Sign up
                            </Button>
                            <p>
                                <span className="text-muted-foreground">Already have an account?</span>
                                {" "}
                                <span className="cursor-pointer hover:underline">Log in</span>
                            </p>
                        </div>
                    </div>
                    <Separator className="my-2 relative">
                        <h6 className="text-muted-foreground bg-background px-3 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">OR</h6>
                    </Separator>
                    <div className="w-full">
                        <Button
                            onClick={signInWithGoogle}
                            variant={"outline"}
                            size={"lg"}
                            disabled={loading}
                            className="flex items-center gap-3 w-full">
                            <Image src={"/assets/logo/google-logo.svg"} alt={"Google logo"} width={20} height={20} className="size-4" />
                            Sign Up with Google
                        </Button>
                    </div>
                </div>
                <div className="col-span-2 size-full border rounded-lg relative overflow-hidden">
                    <Image src={"/assets/forest3.jpg"} alt="forest image" fill className="object-cover rounded-lg" />
                </div>
            </div>
        </div>
    )
}
