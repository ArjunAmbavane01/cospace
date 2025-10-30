"use client";

import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { signUpFormSchema } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import AnimatedInput from "@/components/AnimatedInput";
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { toast } from "sonner";

interface SignUpFormProps {
    authLoading: boolean;
    googleAuthLoading: boolean;
    signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
}

export default function SignUpForm({ authLoading, googleAuthLoading, signUpWithEmail }: SignUpFormProps) {

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
        validators: {
            onSubmit: signUpFormSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                console.log("here1")
                await signUpWithEmail(value.name, value.email, value.password);
                console.log("here2")
            } catch (err: unknown) {
                console.log("here3")
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
                        name="name"
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
                                        label="Name"
                                        placeholder="Name"
                                        autoComplete="name"
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />
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
                            <span>Already have an account? </span>
                            <Link href={"/signin"} className="font-medium text-primary cursor-pointer hover:underline">Log in</Link>
                        </p>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    )
}