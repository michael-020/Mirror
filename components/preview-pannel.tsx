"use client"

import { useEditorStore } from "@/stores/editorStore/useEditorStore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";


export function PreviewPanel() {
    const { webcontainer } = useEditorStore()
    const [url, setUrl] = useState("")

    async function main(){
        if(!webcontainer) {
            console.log("return")
            return
        }

        console.log("hey there")
        const installProcess = await webcontainer.spawn('npm', ['install']);
        console.log("npm i done")

        installProcess.output.pipeTo(new WritableStream({
            write(data) {
            console.log("data: ", data);
            }
        }));

        await webcontainer!.spawn('npm', ['run', 'dev']);
        console.log("npm run dev")

        webcontainer!.on('server-ready', (port, url) => {
            console.log("url: ", url)
            setUrl(url)
        });
    }

    useEffect(() => {
        main()
    }, [])
    
    return (
        <div className="h-full">
            {!url ? 
                <div className="flex gap-4"> 
                    <div>Generative preview</div>
                    <Loader2 className="animate-spin size-16" />
                </div>
            : 
                <iframe 
                    src={url}
                    width="100%" 
                    height="100%" 
                    title="Preview"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
                />
            }
        </div>
    );
}