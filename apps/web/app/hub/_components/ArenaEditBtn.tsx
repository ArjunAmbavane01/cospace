"use client"

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editArena } from "server/actions/arena";
import { Arena, editArenaFormSchema } from "@/lib/validators/arena";
import { useForm } from "@tanstack/react-form";
import z from 'zod';
import { toast } from 'sonner';
import { Field, FieldError, FieldGroup, } from "@/components/ui/field"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import AnimatedInput from "@/components/AnimatedInput";
import { SquarePenIcon, Trash2Icon } from "lucide-react";

interface ArenaEditBtnProps {
    arenaSlug: string;
}

type editArenaFormData = z.infer<typeof editArenaFormSchema>;

export default function ArenaEditBtn({ arenaSlug }: ArenaEditBtnProps) {

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const form = useForm({
        defaultValues: {
            arenaName: ""
        },
        validators: {
            onSubmit: editArenaFormSchema,
        },
        onSubmit: ({ value }) => editArenaMutation(value)
    })


    // edit arena mutation
    const { mutate: editArenaMutation, isPending: isEditing } = useMutation({
        mutationFn: (data: editArenaFormData) => editArena(data.arenaName, arenaSlug),
        onSuccess: (res) => {
            if (res.type === "success") {
                const updatedArenaDetails = res.newArenaDetails;
                const existingArenas = queryClient.getQueryData<Arena[]>(["arenas", userId]) || [];
                const updatedArenas = existingArenas.map(arena=>{
                    if(arena.slug === arenaSlug) arena.name = updatedArenaDetails.name;
                    return arena;
                })
                queryClient.setQueryData(["arenas", userId], [...updatedArenas]);
                toast.success(res.message);
            } else if (res.type === "error") {
                toast.error(res.message)
            };
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "An unexpected error occurred.");
        },
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
                                    <Trash2Icon />
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
