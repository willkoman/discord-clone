"use client";

import { File, FileCheckIcon, X } from "lucide-react";
import Image from "next/image"

import { UploadDropzone } from "@/lib/uploadthing";
interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage";
}

const FileUpload = ({
    onChange,
    value,
    endpoint
} : FileUploadProps) => {

    const fileType = value?.split(".").pop();

    if (value && fileType !== "pdf"){
        return (
            <div className="relative h-20 w-20">
                <Image
                    fill
                    src={value}
                    alt="Server Image"
                    className = "rounded-full"
                />
                <button
                    onClick={() => onChange("")}
                    className = "bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4"  />
                </button>
            </div>
        )
    }
    //if pdf, show pdf icon with X
    if (value && fileType === "pdf"){
        return (
            <div className="flex flex-col items-center">
                <div className="relative h-20 w-20 ">
                    <div className=" border-spacing-6 border-2 border-indigo-400 bg-indigo-100 dark:bg-indigo-950 rounded-full h-20 w-20 flex items-center justify-center">
                        <FileCheckIcon className="h-14 w-14 fill-indigo-200 stroke-indigo-400 " />
                    </div>
                    <button
                        onClick={() => onChange("")}
                        className = "bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm "
                        type="button"
                    >
                        <X className="h-4 w-4"  />
                    </button>
                </div>
                <br/>
                <div className="flex flex-col bg-indigo-100 dark:bg-zinc-950/90 rounded-md w-full">
                    <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 px-2 py-4 text-sm text-indigo-500 dark:text-indigo-200 hover:underline">{value}</a>
                </div>
            </div>
        )
    }

    return ( 
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);

            }
        }
        onUploadError = {(err : Error) => {
            console.log(err);
        }}
        />
     );
}
 
export default FileUpload;