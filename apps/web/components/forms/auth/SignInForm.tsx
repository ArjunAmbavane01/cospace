"use client";

import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { signInFormSchema } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import AnimatedInput from "@/components/AnimatedInput";
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { toast } from "sonner";

interface SignInFormProps {
    authLoading: boolean;
    googleAuthLoading: boolean;
    signInWithEmail: (email: string, password: string) => Promise<void>;
}

export default function SignInForm({ authLoading, googleAuthLoading, signInWithEmail }: SignInFormProps) {

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        validators: {
            onSubmit: signInFormSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                await signInWithEmail(value.email, value.password);
            } catch (err: unknown) {
                toast.error(err instanceof Error ? err.message : "Something went wrong");
            }
        },
    })

    return (
        <div className="w-full">
            <form
                id="signup-form"
                onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}
            >
                <FieldGroup>
                    <form.Field
                        name="email"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <AnimatedInput
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        label="Email"
                                        placeholder="Email"
                                        autoComplete="email"
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />
                    <form.Field
                        name="password"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <AnimatedInput
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        label="Password"
                                        placeholder="Password"
                                        autoComplete="new-password"
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors.slice(0, 1)} />
                                    )}
                                </Field>
                            )
                        }}
                    />
                    <Field className="space-y-1">
                        <Button
                            disabled={authLoading || googleAuthLoading}
                            className="w-full"
                            type="submit"
                            form="signup-form"
                        >
                            {authLoading ? <Spinner /> : "Continue"}
                        </Button>
                        <p className="text-center">
                            <span className="text-muted-foreground">New to CoSpace? </span>
                            <Link href={"/signup"} className="font-medium text-primary cursor-pointer hover:underline">Sign up</Link>
                        </p>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    )
}