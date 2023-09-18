"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";
import { on } from 'events';



export const InviteModal = () => {
    const {onOpen, isOpen, onClose, type, data} = useModal();

    const isModalOpen = isOpen && type === "invite";
    const {server} = data;
    const origin = useOrigin();

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const onNew = async () => {
        try{
            setIsLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

            onOpen("invite", {server: response.data})
        }
        catch(e){
            console.log(e);
        }
        finally{
            setIsLoading(false);
        }
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black dark:bg-zinc-800 dark:text-white p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-300">
                        Invite Link
                    </Label>
                    <div className = "flex items-center mt-2 gap-x-2">
                        <Input 
                        disabled = {isLoading}
                        className="bg-zinc-300/50 dark:bg-zinc-200 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        value = {inviteUrl}
                        onChange={() => {}}
                        />
                        <Button disabled={isLoading} size="icon" onClick={onCopy}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                    <Button disabled={isLoading} 
                        variant = "link"
                        size="sm"
                        className="text-xs text-zinc-500 dark:text-zinc-300 mt-4"
                        onClick={onNew}
                    >
                        Generate a New Link
                        <RefreshCw className = "w-4 h-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}