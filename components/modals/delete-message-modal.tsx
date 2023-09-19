"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import qs from "query-string"

export const DeleteMessageModal = () => {
    const {isOpen, onClose, type, data} = useModal();

    const isModalOpen = isOpen && type === "deleteMessage";
    const {apiUrl, query} = data;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            });
            await axios.delete(url);

            onClose();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-zinc-800 text-black dark:text-white p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Message?
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500 dark:text-zinc-300">
                        The message will be permanently deleted
                        <br/>
                        <span className="font-semibold text-rose-500">This cannot be undone</span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 dark:bg-zinc-900 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                    <Button
                    disabled={isLoading}
                    onClick={onClose}
                    variant="ghost"
                    >
                        Cancel
                        </Button>
                    <Button
                    disabled={isLoading}
                    variant="primary"
                    onClick={onClick}
                    >
                        Confirm
                    </Button>
                    </div>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}