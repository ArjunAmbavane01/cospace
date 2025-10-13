"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { signUpFormSchema } from "@/lib/validators/auth";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface SignUpFormProps {
    authLoading: boolean;
    googleAuthLoading: boolean;
    signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
}

export default function SignUpForm({ authLoading, googleAuthLoading, signUpWithEmail }: SignUpFormProps) {

    const form = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof signUpFormSchema>) => {
        try {
            await signUpWithEmail(data.name, data.email, data.password);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Something went wrong");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-5 w-full">
                <div className="space-y-3 w-full">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="name" {...field} />
                                </FormControl>
                                <FormMessage className="text-xs text-left" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="email" {...field} />
                                </FormControl>
                                <FormMessage className="text-xs text-left" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="password" {...field} />
                                </FormControl>
                                <FormMessage className="text-xs text-left" />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="space-y-2 w-full">
                    <Button
                        disabled={authLoading || googleAuthLoading}
                        className="w-full"
                        type="submit"
                    >
                        {authLoading ? <Spinner /> : "Continue"}
                    </Button>
                    <p>
                        <span className="text-muted-foreground">Already have an account? </span>
                        <Link href={"/signin"} className="font-medium text-primary cursor-pointer hover:underline">Log in</Link>
                    </p>
                </div>
            </form>
        </Form>
    )
}