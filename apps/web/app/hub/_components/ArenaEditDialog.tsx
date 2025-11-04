"use client"

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { editArena } from "server/actions/arena";
import useAuthStore from "store/authStore";
import { Arena, editArenaFormSchema } from "@/lib/validators/arena";
import z from 'zod';
import { Field, FieldError, FieldGroup, } from "@/components/ui/field"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import AnimatedInput from "@/components/AnimatedInput";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from 'sonner';
import { SquarePenIcon } from "lucide-react";

interface ArenaEditDialogProps {
    arenaSlug: string;
    arena: Arena;
}

type editArenaFormData = z.infer<typeof editArenaFormSchema>;

export default function ArenaEditDialog({ arenaSlug, arena }: ArenaEditDialogProps) {

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    const form = useForm({
        defaultValues: {
            arenaName: arena.name
        },
        validators: {
            onSubmit: editArenaFormSchema,
        },
        onSubmit: ({ value }) => editArenaMutation(value)
    })

    // edit arena mutation
    const { mutate: editArenaMutation, isPending: isEditing } = useMutation({
        mutationFn: async (data: editArenaFormData) => {
            const res = await editArena(data.arenaName, arenaSlug);
            if (res.type === "error") throw new Error(res.message);
            return res;
        },
        onMutate: async (inputData) => {
            await queryClient.cancelQueries({ queryKey: ["arenas", user?.id] })
            const previousArenas = queryClient.getQueryData<Arena[]>(["arenas", user?.id]);
            if (previousArenas) {
                queryClient.setQueryData(
                    ["arenas", user?.id],
                    previousArenas.map(a =>
                        a.slug === arenaSlug ? { ...a, name: inputData.arenaName } : a
                    )
                );

            }
            return { previousArenas }
        },
        onSuccess: (res) => {
            setModalOpen(false);
            toast.success(res.message);
        },
        onError: (err, _, context) => {
            if (context?.previousArenas) {
                queryClient.setQueryData(["arenas", user?.id], context.previousArenas);
            }
            toast.error(err.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["arenas", user?.id] })
        }
    })

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem
                    onClick={(e) => {
                        e.preventDefault();
                        setModalOpen(true);
                    }}
                >
                    <SquarePenIcon />
                    Edit
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Edit Arena</DialogTitle>
                    <div className='py-5'>
                        <form
                            id="edit-arena-form"
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
                        disabled={isEditing}
                        type="submit"
                        form="edit-arena-form"
                    >
                        {
                            isEditing ? (
                                <>
                                    <Spinner />
                                    Saving
                                </>
                            ) : (
                                <>
                                    <SquarePenIcon />
                                    Edit
                                </>
                            )
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
