"use client";

import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";
import {format} from "date-fns";
import Image from "next/image";
import { ChatItem } from "./chat-item";
import { useRef, useEffect } from 'react';
import { useChatSocket } from "@/hooks/use-chat-socket";

const DATE_FORMAT = "d MMM yyyy 'at' h:mm a";

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile;
    }
}

interface ChatMessagesProps {
    name:string,
    member:Member,
    chatId:string,
    apiUrl:string,
    socketUrl:string,
    socketQuery:Record<string,string>,
    paramKey: "channelId" | "conversationId",
    paramValue:string,
    type: "channel" | "conversation",
}

export const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type,
}:ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`;
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:messages:update`;
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const hasLoadedRef = useRef(false);
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue,
    });
    useChatSocket({queryKey,addKey,updateKey});

    const isUserAtBottom = (): boolean => {
        const container = chatContainerRef.current;
        if (!container) return false;
        return container.scrollHeight - container.scrollTop <= container.clientHeight * 1.2;
    }
    useEffect(() => {
        if (isUserAtBottom()) {
            const container = chatContainerRef.current;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }
    }, [data]);
    useEffect(() => {
        const container = chatContainerRef.current;
        if (hasLoadedRef.current) return;
        if (container && data) {  // check if data has been loaded
            container.scrollTop = container.scrollHeight;
            hasLoadedRef.current = true;
        }
        // This dependency array ensures the effect runs whenever 'data' changes, but the internal check will prevent it from scrolling more than once.
    }, [data]);

    if(status === "loading") return (
        <div className="flex flex-col flex-1 justify-center items-center"> 
            <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4"/>
            <p className="text-zinc-500 text-xs dark:text-zinc-400">Loading messages...</p>
        </div>
    );
    if(status === "error") return (
        <div className="flex flex-col flex-1 justify-center items-center"> 
            <ServerCrash className="h-7 w-7 text-zinc-500 my-4"/>
            <p className="text-zinc-500 text-xs dark:text-zinc-400">Something went wrong. Please refresh and try again!</p>
        </div>
    );
    return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto" ref={chatContainerRef}>
            <div className="flex-1" />
            <ChatWelcome
                type={type}
                name={name}
            />
            <div className=" flex flex-col-reverse mt-auto " >
                {data?.pages.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map((message: MessageWithMemberWithProfile) => (
                            <ChatItem
                            currentMember={member}
                            member={message.member}
                            key={message.id}
                            id={message.id}
                            content={message.content}
                            fileUrl={message.fileUrl}
                            deleted={message.deleted}
                            timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                            isUpdated={message.updatedAt !== message.createdAt}
                            socketUrl={socketUrl}
                            socketQuery={socketQuery}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>

        </div>
    )
}