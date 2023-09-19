import { useSocket } from "@/components/providers/socket-provider";
import { useQueryClient } from "@tanstack/react-query";
import { Message, Profile } from "@prisma/client";
import { useEffect } from "react";

type ChatSocketProps = {
    addKey: string;
    updateKey: string;
    queryKey: string;
}

type MessageWithMemberWithProfile = Message & {
    member: {
        profile: Profile;
    }
}

export const useChatSocket = ({ addKey, updateKey, queryKey }: ChatSocketProps) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return;

        socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || !oldData.pages.length) return oldData;

                const newData = oldData.pages.map((page: any) => {
                    return {
                        ...page,
                        items: page.items.map((item: MessageWithMemberWithProfile) => {
                            if (item.id === message.id) return message;
                            return item;
                        })
                    };
                });

                return {
                    ...oldData,
                    pages: newData,
                };
            });

        });

        socket.on(addKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || !oldData.pages.length) return {
                    pages: [{
                        items: [message],
                    }]
                }

            const newData = [...oldData.pages];

            newData[0] = {
                ...newData[0],
                items: [message, ...newData[0].items],
            };
            return {
                ...oldData,
                pages: newData,
            };
            });

        });

        return () => {
            socket.off(addKey);
            socket.off(updateKey);
        };
    }, [socket, updateKey, addKey, queryKey, queryClient]);
};
