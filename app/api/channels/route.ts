import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(

    req: Request,

) {
    try {
        const profile = await currentProfile();
        const { name, type,description }= await req.json();
        const {searchParams}= new URL(req.url);

        const serverId = searchParams.get("serverId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        if (name === "general"){
            return new NextResponse("Name cannot be general", { status: 400 });
        }
        //if name has spaces return error
        if (name.includes(" ")){
            return new NextResponse("Name cannot have spaces", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role:{
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    },
                },
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        description,
                        name,
                        type,
                    },
                },
            },
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("Channels POST error: ", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
