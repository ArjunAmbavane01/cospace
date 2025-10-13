"use client"

import { useState } from 'react';
import { createArena } from 'server/actions/arena/create';
import { createArenaFormSchema } from '@/lib/validators/createArena';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface CreateArenaBtnProps {
    userId:string;
}

export default function CreateArenaBtn({userId}:CreateArenaBtnProps) {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const form = useForm<z.infer<typeof createArenaFormSchema>>({
        resolver: zodResolver(createArenaFormSchema),
        defaultValues: {
            arenaName: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof createArenaFormSchema>) => {
        try {
            const res = await createArena(data.arenaName,userId);
            console.log(res)
            if (res.type === "success") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            setModalOpen(false);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong");
        }
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
                                    onClick={handleModalClose}
                                    type="submit"
                                >
                                    Create Arena
                                </Button>
                            </form>
                        </Form>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
