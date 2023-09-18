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
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { ChannelType } from "@prisma/client";
import { on } from 'events';


const formSchema = z.object({
    name: z.string().min(1, {message: "Channel name is required"}).max(100,{message:  "Channel name must be less than 100 characters"})
    .refine(name => name !=="general", {message: "Channel name cannot be 'general'"})
    .refine(name=> name.split(" ").length === 1, {message: "Channel name cannot contain spaces"}),
    description: z.string().max(255, {message: "Channel description must be less than 255 characters"}),
    type: z.nativeEnum(ChannelType),
});

export const CreateChannelModal = () => {
    const { isOpen, onClose, type} = useModal();

    const router = useRouter();
    const params = useParams();

    const isModalOpen = isOpen && type === "createChannel";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            type: ChannelType.TEXT,
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: "/api/channels",
                query: {
                    serverId: params?.serverId
                },
            });

            await axios.post(url, values);

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
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your channel
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
                                        <FormLabel className = "uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Channel Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading}
                                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" placeholder="Enter channel name" 
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
                                        <FormLabel className = "uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Channel Description
                                        </FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading}
                                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" placeholder="Enter channel description" {...field} />
                                        </FormControl>
                                        <FormMessage>{form.formState.errors.description?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Channel Type
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                className = "bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                                    <SelectValue 
                                                    placeholder = "Select a channel type" 
                                                    className="capitalize"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem key={type} value={type} className="capitalize">
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button disabled={isLoading} className="" variant={"primary"}>
                                Create Channel
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}