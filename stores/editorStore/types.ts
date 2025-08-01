import { WebContainer } from "@webcontainer/api"

export interface BuildStep {
    id: string
    title: string
    description: string
    type: BuildStepType
    status: statusType
    timestamp?: Date
    code?: string;
    path?: string;
    shouldExecute?: boolean; 
}

export enum statusType {
    Pending, 
    InProgress,
    Completed,
    Error
}

export enum BuildStepType {
    CreateFile,
    CreateFolder,
    EditFile,
    DeleteFile,
    RunScript,
    NonExecutuable
}


export type FileItemFlat = {
  name: string
  path: string
  type: "file" | "folder"
  content: string
}

export interface FileContent {
    name: string
    content: string
    path: string
}

export type ChatMessage = {
  role: "user" | "assistant",
  content: string
}

export interface StoreState {
    // Build status
    buildSteps: BuildStep[]
    isBuilding: boolean
    isInitialising: boolean,
    isProcessing: boolean,
    isProcessingFollowups: boolean,

    // File system
    fileItems: FileItemFlat[]
    files: Record<string, FileContent>
    selectedFile: string | null

    shellCommands: string[]
    webcontainer: WebContainer | null;
    messages: ChatMessage[]


    // Actions
    setWebcontainer: (instance: WebContainer) => void;
    setBuildSteps: (steps: BuildStep[]) => void
    clearBuildSteps: () => void
    startBuild: () => void
    stopBuild: () => void
    setStepStatus: (id: string, status: statusType) => void
    setSelectedFile: (path: string | null) => void
    updateFileContent: (path: string, content: string) => void
    setFileItems: (items: FileItemFlat[]) => void
    setFiles: (files: Record<string, FileContent>) => void
    addFile: (path: string, content: string) => void
    addFileItem: (item: FileItemFlat) => void
    executeSteps: (steps: BuildStep[]) => Promise<void>
    processPrompt: (prompt: string) => void;
    setShellCommand: (command: string) => void;
    setMessages: (messages: ChatMessage | ChatMessage[]) => void;
    processFollowupPrompts: (prompt: string, messages: string[]) => void;
}
