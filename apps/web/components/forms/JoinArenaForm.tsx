"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "@tanstack/react-form"
import { joinArenaFormSchema } from '@/lib/validators/arena';
import { ArenaMutation } from 'app/hub/_components/HubDashboard';
import AnimatedInput from '../AnimatedInput';
import { Button } from "@/components/ui/button"
import { Spinner } from '@/components/ui/spinner';
import { Field, FieldError, FieldGroup, } from "@/components/ui/field"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface JoinArenaFormProps {
    joinArena: ArenaMutation;
    isJoining: boolean;
}

export default function JoinArenaForm({ joinArena, isJoining }: JoinArenaFormProps) {

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            inviteLink: ""
        },
        validators: {
            onSubmit: joinArenaFormSchema,
        },
        onSubmit: ({ value }) => {
            const slug = value.inviteLink.split("http://localhost:3000/arena/")[1];
            if (!slug) return;
            joinArena(slug);
            router.push(value.inviteLink);
        }
    })

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
                <Button
                    size="lg"
                    variant="secondary"
                >
                    Join Arena
                </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Join Arena</DialogTitle>
                    <div className='py-5 pt-8'>
                        <form
                            id="join-arena-form"
                            onSubmit={(e) => {
                                e.preventDefault()
                                form.handleSubmit()
                            }}
                        >
                            <FieldGroup>
                                <form.Field
                                    name="inviteLink"
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
                                                    label="Invite Link"
                                                    placeholder="Invite Link"
                                                    autoComplete="off"
                                                />
                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors.slice(0, 1)} />
                                                )}
                                            </Field>
                                        )
                                    }}
                                />
                            </FieldGroup>
                        </form>
                    </div>
                </DialogHeader>
                <DialogFooter className="flex gap-3">
                    <Button
                        variant={"default"}
                        disabled={isJoining}
                        type="submit"
                        form="join-arena-form"
                    >
                        {isJoining ? (
                            <span className='flex items-center gap-1'>
                                <Spinner />
                                Joining
                            </span>
                        ) : "Join Arena"}
                    </Button>
                    <Button
                        variant={"ghost"}
                        onClick={() => setModalOpen(false)}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
