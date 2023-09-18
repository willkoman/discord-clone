import {Check, Hash, Menu, ShieldCheck} from "lucide-react";
import { MobileToggle } from "../mobile-toggle";
import { Avatar, AvatarImage } from "../ui/avatar";
import { UserAvatar } from "../user-avatar";
import { SocketIndicator } from "../socket-indicator";

interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: "channel" | "conversation";
    imageUrl?: string;
}


export const ChatHeader = ({
    serverId,
    name,
    type,
    imageUrl
}:ChatHeaderProps) => {
    return (
        <div className="flex text-md font-semibold items-center px-3 h-12 border-b-2 border-neutral-200 dark:border-neutral-800">
            <MobileToggle
                serverId={serverId}
            />
            {type === "channel" && (
                <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
            )}
            {type === "conversation" && (
                <UserAvatar
                    src={imageUrl}
                    className="h-8 w-8 md:h-8 md:w-8 mr-2"
                />
            )}
            <p className = "font-semibold text-md text-black dark:text-white">
                {name}
            </p>
            <div className="ml-auto flex items-center">
                <SocketIndicator />
            </div>
        </div>
    )
}