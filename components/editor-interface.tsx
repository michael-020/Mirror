"use client"

import { useEffect, useRef, useState } from "react"
import { StatusPanel } from "@/components/status-panel"
import { useEditorStore } from "@/stores/editorStore/useEditorStore"
import { Loader2 } from "lucide-react"
import { EditorWorkspace } from "@/components/editor-workspace"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Navbar from "./navbar"
import RightSidebar from "./sidebar"
import { InitLoadingModal } from "./init-loading-modal"
import { Group, Panel, Separator } from "react-resizable-panels"

export function EditorInterface({
  onBack,
  shouldInitialize
}: {
  onBack?: () => void,
  shouldInitialize?: boolean
}) {
  const { setSelectedFile, fileItems, isInitialising, isInitialisingWebContainer } = useEditorStore()
  const hasSelectedInitialFile = useRef(false)
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const sidebarVisible = isOpen || isHovered;
  
  useEffect(() => {
    if(status === "loading") return
    if (!session) {
      redirect("/")
    }
  }, [session, status])

  useEffect(() => {
    if (!hasSelectedInitialFile.current && fileItems.length > 0) {
      const firstFile = fileItems.find(f => f.type === "file")
      if (firstFile) {
        setSelectedFile(firstFile.path)
        hasSelectedInitialFile.current = true
      }
    }
  }, [fileItems, setSelectedFile])
  
  useEffect(() => {
    const threshold = 25;
    const sidebarWidth = 256; 
  
    const onMouseMove = (e: MouseEvent) => {
      const isNearRightEdge = window.innerWidth - e.clientX <= threshold;
      const isInsideSidebar = e.clientX >= window.innerWidth - sidebarWidth;
      
      if (isNearRightEdge) {
        setIsHovered(true);
      } else if (!isInsideSidebar && isHovered) {
        setIsHovered(false);
      }
    };
  
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [isHovered]);
 
  const handleSidebarMouseLeave = () => {
    setIsHovered(false);
  };

  const handleSidebarClose = () => {
    setIsOpen(false);
    setIsHovered(false);
  };

  
  if(!session){
     return <div className="h-screen bg-neutral-50 dark:bg-black flex items-center justify-center">
       <Loader2 className="size-14 animate-spin text-neutral-950 dark:text-neutral-200" />
     </div>
   }

  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-black text-white">
      <Navbar
        onPanelToggle={() => setIsOpen(!isOpen)}
        showPanelToggle={true}
        onBack={onBack}
        showBackButton={true}
      />

      <div className="flex fixed top-[60px] h-[calc(100vh-60px)] w-screen overflow-hidden">
        <Group>
          {!isFullscreen && (
            <Panel collapsible defaultSize={"25%"} minSize={"17%"}>
              <div 
                className="h-full bg-neutral-50 dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 relative z-0"
              >
                <StatusPanel />
              </div>
            </Panel>
          )}
          <Separator className="relative w-0.5 bg-neutral-300 dark:bg-neutral-800 [&[data-separator='hover']]:bg-neutral-400 [&[data-separator='active']]:bg-neutral-500/90  dark:[&[data-separator='hover']]:bg-neutral-700 dark:[&[data-separator='active']]:bg-neutral-600 flex justify-center outline-none focus:outline-none focus:ring-0">
            <div className="absolute top-1/2 -translate-y-1/2 w-2 h-8 rounded-md bg-neutral-400 dark:bg-neutral-600 hover:bg-neutral-500 dark:hover:bg-neutral-500 transition-colors duration-150" />
          </Separator>

          <Panel minSize={"20vw"}>
            <div className="z-30">
              <EditorWorkspace isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen} />
            </div>
          </Panel>
        </Group>
      </div>

      {shouldInitialize && (isInitialising || isInitialisingWebContainer) && <InitLoadingModal message={`${isInitialisingWebContainer ? "Initialising Environment..." : "Initialising project..."}`} />}
      <RightSidebar
        isOpen={sidebarVisible}
        setIsOpenAction={handleSidebarClose}
        onMouseLeaveAction={handleSidebarMouseLeave}
      />
    </div>
  )
}