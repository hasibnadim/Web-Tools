"use client";
import React, { useEffect, useState } from "react";

const PWAInstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null); 

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener("beforeinstallprompt", handler);
 

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    if (!deferredPrompt) return null;

    return (
        <button
            className="fixed bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded shadow"
            onClick={async () => {
                // eslint-disable-next-line
                (deferredPrompt as any).prompt(); 
 
            }}
        >
            Install App
        </button>
    );
};

export default PWAInstallButton;