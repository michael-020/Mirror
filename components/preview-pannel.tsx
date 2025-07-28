"use client"


export function PreviewPanel() {

    
    return (
        <div className="h-full">
            <iframe 
                width="100%" 
                height="100%" 
                title="Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
            />
        </div>
    );
}