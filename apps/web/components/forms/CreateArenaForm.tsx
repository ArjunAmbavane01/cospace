"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createArena } from 'server/actions/arena';
import useAuthStore from 'store/authStore';
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createArenaFormSchema } from '@/lib/validators/arena';
import { Arena } from '@/lib/validators/arena';
import z from 'zod';
import { toast } from 'sonner';
import AnimatedInput from '../AnimatedInput';
import { Button } from "@/components/ui/button"
import { Spinner } from '@/components/ui/spinner';
import { Field, FieldError, FieldGroup, } from "@/components/ui/field"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FiPlus } from "react-icons/fi";

type createArenaFormData = z.infer<typeof createArenaFormSchema>;

export default function CreateArenaForm() {

    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const router = useRouter();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    const form = useForm({
        defaultValues: {
            arenaName: ""
        },
        validators: {
            onSubmit: createArenaFormSchema,
        },
        onSubmit: ({ value }) => addArenaMutation(value)
    })

    const { mutate: addArenaMutation, isPending: isCreating } = useMutation({
        mutationFn: (data: createArenaFormData) => createArena(data.arenaName),
        onSuccess: (res) => {
            if (res.type === "success" && res.arena) {
                const existingArenas = queryClient.getQueryData<Arena[]>(["arenas", user?.id]) || [];
                queryClient.setQueryData(["arenas", user?.id], [res.arena, ...existingArenas]);
                toast.success(res.message);
                setModalOpen(false);
                form.reset();
                handleModalClose();
                router.push(`/arena/${res.arena.slug}`);
            } else if (res.type === "error") toast.error(res.message);
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "An unexpected error occurred.");
        },
    })

    const handleModalClose = () => setModalOpen((c) => !c);

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={"3d"}
                    size={"lg"}
                    className='text-base'
                >
                    <FiPlus />
                    Create Arena
                </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Create Arena</DialogTitle>
                    <div className='py-5'>
                        <form
                            id="create-arena-form"
                            onSubmit={(e) => {
                                e.preventDefault()
                                form.handleSubmit()
                            }}
                        >
                            <FieldGroup>
                                <form.Field
                                    name="arenaName"
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
                                                    label="Arena Name"
                                                    placeholder="Arena Name"
                                                    autoComplete="off"
                                                />
                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors} />
                                                )}
                                            </Field>
                                        )
                                    }}
                                />
                            </FieldGroup>
                        </form>
                    </div>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        disabled={isCreating}
                        type="submit"
                        form="create-arena-form"
                    >
                        {isCreating ? (
                            <span className='flex items-center gap-1'>
                                <Spinner />
                                Creating
                            </span>
                        ) :
                            <>
                                <FiPlus />
                                Create Arena
                            </>
                        }
                    </Button>
                    <Button
                        variant={"ghost"}
                        onClick={() => setModalOpen(false)}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
