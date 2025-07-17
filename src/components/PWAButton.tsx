"use client";
import React, { useEffect, useState } from "react";

const PWAInstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener("beforeinstallprompt", handler);

        window.addEventListener("appinstalled", () => setIsInstalled(true));

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    if (isInstalled || !deferredPrompt) return null;

    return (
        <button
            className="fixed bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded shadow"
            onClick={async () => {
                // eslint-disable-next-line
                (deferredPrompt as any).prompt();
                // eslint-disable-next-line
                const { outcome } = await (deferredPrompt as any).userChoice;
                if (outcome === "accepted") setIsInstalled(true);
            }}
        >
            Install App
        </button>
    );
};

export default PWAInstallButton;