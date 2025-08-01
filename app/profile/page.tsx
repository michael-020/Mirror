"use client"

import { useEditorStore } from "@/stores/editorStore/useEditorStore"
import { useState } from "react"

export default  function Profile () {
    const { data, processPrompt } = useEditorStore()
    const [ prompt, setPrompt ] = useState("")

    const handleSubmit = () => {
        processPrompt(prompt)
    }

    return <div>
        <div className="w-screen pt-20 gap-3 flex items-center justify-center">
            <input onChange={(e) => setPrompt(e.target.value)} type="text" className="border"/>
            <button onClick={handleSubmit} className="p-2 border bg-neutral-700 text-gray-50" >Submit</button>
        </div>
        <div className="w-screen flex items-center justify-center">
            { data }
        </div>
    </div>
}