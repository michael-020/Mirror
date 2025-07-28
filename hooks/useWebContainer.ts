import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';

// Global singleton instance to prevent multiple WebContainer instances
let webContainerInstance: WebContainer | null = null;
let isBooting = false;

export function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<WebContainer | undefined>(webContainerInstance || undefined);

    useEffect(() => {
        const initWebContainer = async () => {
            // If we already have an instance, use it
            if (webContainerInstance) {
                setWebcontainer(webContainerInstance);
                return;
            }

            // If we're already booting, wait for it
            if (isBooting) {
                const checkInterval = setInterval(() => {
                    if (webContainerInstance) {
                        setWebcontainer(webContainerInstance);
                        clearInterval(checkInterval);
                    }
                }, 100);
                return () => clearInterval(checkInterval);
            }

            // Start booting
            try {
                isBooting = true;
                console.log("Booting WebContainer...");
                webContainerInstance = await WebContainer.boot();
                setWebcontainer(webContainerInstance);
                console.log("WebContainer booted successfully");
            } catch (error) {
                console.error("Failed to boot WebContainer:", error);
                // Reset flags on error so we can try again
                webContainerInstance = null;
                isBooting = false;
            } finally {
                isBooting = false;
            }
        };

        initWebContainer();

        // Cleanup function
        return () => {
            // Don't destroy the WebContainer instance here as it should persist
            // across component unmounts for better performance
        };
    }, []);

    return webcontainer;
}

// Optional: Export a function to manually destroy the WebContainer if needed
export const destroyWebContainer = async () => {
    if (webContainerInstance) {
        try {
            await webContainerInstance.teardown();
        } catch (error) {
            console.error("Error tearing down WebContainer:", error);
        } finally {
            webContainerInstance = null;
            isBooting = false;
        }
    }
};