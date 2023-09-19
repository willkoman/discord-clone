"use client";
import * as z from "zod";
import qs from "query-string"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {  useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import { use, useEffect } from "react";


const formSchema = z.object({
    name: z.string().min(1, {message: "Channel name is required"}).max(100,{message:  "Channel name must be less than 100 characters"})
    .refine(name => name !=="general", {message: "Channel name cannot be 'general'"})
    .refine(name=> name.split(" ").length === 1, {message: "Channel name cannot contain spaces"}),
    description: z.string().max(255, {message: "Channel description must be less than 255 characters"}),
    type: z.nativeEnum(ChannelType),
});

export const EditChannelModal = () => {
    const { isOpen, onClose, type, data} = useModal();

    const router = useRouter();


    const isModalOpen = isOpen && type === "editChannel";
    const {channel, server} = data;
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            type: channel?.type || ChannelType.TEXT,
        },
    });

    useEffect(() => {
        if(channel){
            form.setValue("name", channel.name);
            form.setValue("description", channel.description);
            form.setValue("type", channel.type);
        }
    }, [form, channel]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                },
            });

            await axios.patch(url, values);

            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    //get default onchange
    
    return (
        
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black dark:bg-zinc-800 dark:text-white p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Edit Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">

                            <FormField
                                control={form.control}
                                name="name"

                                render={({ field }) => (


                                    <FormItem>
                                        <FormLabel className = "uppercase text-xs font-bold text-zinc-500 dark:text-zinc-300">
                                            Channel Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading}
                                            className="bg-zinc-300/50 dark:bg-zinc-700 dark:text-white border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" placeholder="Enter channel name" 
                                            {...field}
                                            onChange={(e) => {
                                                e.target.value = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[!-\/:-@\[-`{-~]/g, '-'); ;
                                                field.onChange(e);
                                            }} />
                                        </FormControl>
                                        <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className = "uppercase text-xs font-bold text-zinc-500 dark:text-zinc-300">
                                            Channel Description
                                        </FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading}
                                            className="bg-zinc-300/50 dark:bg-zinc-700 dark:text-white border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" placeholder="Enter channel description" {...field} />
                                        </FormControl>
                                        <FormMessage>{form.formState.errors.description?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 dark:bg-zinc-900 px-6 py-4">
                            <Button disabled={isLoading} className="" variant={"primary"}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}