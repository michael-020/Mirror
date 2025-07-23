export interface BuildStep {
    id: string
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


export type FileItemFlat = {
  name: string
  path: string
  type: "file" | "folder"
  content?: string
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
    fileItems: FileItemFlat[]
    files: Record<string, FileContent>
    selectedFile: string | null

    // Actions
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
}
