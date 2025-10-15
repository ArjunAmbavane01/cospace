"use client"

import { useState } from 'react';
import { createArena } from 'server/actions/arena/createArena';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createArenaFormSchema } from '@/lib/validators/createArena';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Arena } from '@/lib/validators/arena';
import { User } from 'better-auth';
import z from 'zod';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CreateArenaBtnProps {
    user: User;
}

type createArenaFormData = z.infer<typeof createArenaFormSchema>;

export default function CreateArenaBtn({ user }: CreateArenaBtnProps) {

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const router = useRouter();

    const queryClient = useQueryClient();
    const { id: userId, name: userName } = user;

    const form = useForm<createArenaFormData>({
        resolver: zodResolver(createArenaFormSchema),
        defaultValues: {
            arenaName: "",
        },
    });

    const { mutate: addArenaMutation, isPending } = useMutation({
        mutationFn: (data: createArenaFormData) => createArena(data.arenaName, userId, userName),
        onSuccess: (res) => {
            console.log("here")
            if (res.type === "success" && res.arena) {
                const existingArenas = queryClient.getQueryData<Arena[]>(["arenas", userId]) || [];
                queryClient.setQueryData(["arenas", userId], [res.arena, ...existingArenas]);
                toast.success(res.message);
                setModalOpen(false);
                form.reset();
                router.push(`/arena/${res.arena.slug}`);

            } else if (res.type === "error") {
                toast.error(res.message);
            }
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "An unexpected error occurred.");
        },
    })

    const onSubmit = (data: createArenaFormData) => {
        addArenaMutation(data);
    }

    const handleModalClose = () => setModalOpen((c) => !c);

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
                <Button size={"lg"}>
                    <Plus className='stroke-2' />
                    <h4>
                        Create Arena
                    </h4>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Arena</DialogTitle>
                    <div className='py-5'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="arenaName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Arena Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    disabled={isPending}
                                    onClick={handleModalClose}
                                    type="submit"
                                >
                                    {isPending ? (
                                        <span className='flex items-center gap-1'>
                                            Creating
                                            <Spinner />
                                        </span>
                                    ) : "Create Arena"}:
                                </Button>
                            </form>
                        </Form>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
