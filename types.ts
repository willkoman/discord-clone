import {Server as NetServer, Socket} from "net";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as SockerIOServer } from "socket.io";
import { Server, Member, Profile } from '@prisma/client'

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & { profile: Profile })[];
}

export type NextApiResponseServerIO = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SockerIOServer;
        };
    };
};