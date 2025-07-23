export interface BuildStep {
    id: number
    title: string
    description: string
    type: BuildStepType
    status: statusType
    timestamp?: Date
    code?: string;
    path?: string;
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
    RunScript
}

interface FileItem {
    name: string
    path: string
    type: "file" | "folder"
    content?: string
    children?: FileItem[]
}

interface FileContent {
    name: string
    content: string
    path: string
}

export interface StoreState {
    // Build status
    buildSteps: BuildStep[]
    isBuilding: boolean

    // File system
    fileTree: FileItem[]
    files: Record<string, FileContent>
    selectedFile: string | null

    // Actions
    setBuildSteps: (steps: BuildStep[]) => void
    clearBuildSteps: () => void
    startBuild: () => void
    stopBuild: () => void

    setSelectedFile: (path: string | null) => void
    updateFileContent: (path: string, content: string) => void
    addFile: (name: string, content: string) => void
    addFolder: (name: string) => void
}
