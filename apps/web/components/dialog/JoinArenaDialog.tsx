"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { joinArena } from 'server/actions/arena';
import useAuthStore from 'store/authStore';
import { useForm } from "@tanstack/react-form"
import { JoinArenaDialogSchema } from '@/lib/validators/arena';
import AnimatedInput from '../AnimatedInput';
import { Button } from "@/components/ui/button"
import { Spinner } from '@/components/ui/spinner';
import { Field, FieldError, FieldGroup, } from "@/components/ui/field"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function JoinArenaDialog() {

    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const router = useRouter();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    const form = useForm({
        defaultValues: {
            inviteLink: ""
        },
        validators: {
            onSubmit: JoinArenaDialogSchema,
        },
        onSubmit: async ({ value }) => {
            const slug = value.inviteLink.split("http://localhost:3000/arena/")[1];
            if (!slug) return;
            joinArenaMutation(slug);
        }
    })

    // join arena mutation
    const { mutate: joinArenaMutation, isPending: isJoining } = useMutation({
        mutationFn: async (arenaSlug: string) => {
            const res = await joinArena(arenaSlug);
            if (res.type === "error") throw new Error(res.message);
            return res;
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["arenas", user?.id] })
            toast.success(res.message);
            setModalOpen(false);
            form.reset();
            router.push(`/arena/${res.arenaSlug}`)
        },
        onError: (err) => {
            toast.error(err.message);
        },
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
