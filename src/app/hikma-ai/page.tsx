"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send, Loader2 } from "lucide-react";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import BWMarkdown from "@/components/BWMarkdown";

const HikamAI = () => {
  const auth = useAuth();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [controller, setController] = React.useState<AbortController | null>(null);


  const handleSendMessage = async (message: string) => {
    const updatedChat = [...chat, message, "..."];
    setChat(updatedChat);
    setLoading(true);
    setMessage("");

    try {
      const newController = new AbortController();
      setController(newController);
      const res = await fetch("/hikma-ai/api", {
        method: "POST",
        body: JSON.stringify({ prompt: message }),
        headers: { "Content-Type": "application/json" },
        signal: newController.signal,
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let result = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value);
          setChat([...updatedChat.slice(0, -1), result]);
        }
      }
    } catch (error: unknown) {
      if ((error as Error).name === 'AbortError') {
        setChat((prev) => {
          const newChat = [...prev];
          newChat[newChat.length - 1] = "*[stopped]*";
          return newChat;
        });
      } else {
        console.error("Fetch error:", error);
      }
    } finally {
      setLoading(false);
      setController(null);
    }
  };

  if (!auth.isAuthenticated && !auth.isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-4">
        <Card className="w-full max-w-md bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl">
          <CardContent className="p-6 text-center">
            <h1 className="text-3xl font-bold text-white">Hikam AI</h1>
            <p className="text-lg text-purple-300 my-2">
              You need to login to access this page
            </p>
            <Link
              href="/auth/login"
              className="bg-purple-700 hover:bg-purple-900 text-white py-2 px-6 rounded-lg"
            >
              Login
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Loader isLoading={auth.isLoading}>
          <div className="flex flex-col space-y-4">
            <div className="overflow-y-auto space-y-4 max-h-[70vh]">
              {chat.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg shadow ${index % 2 === 0
                    ? "bg-slate-700/50 text-white"
                    : "bg-purple-700/50 text-white"
                    }`}
                >
                  <BWMarkdown>{message}</BWMarkdown>
                </div>
              ))}
            </div>

            <form
              className="flex flex-col bg-white/10 dark:bg-slate-700/40 p-4 rounded-xl shadow space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (message.trim()) handleSendMessage(message);
              }}
            >
              <Textarea
                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none resize-none"
                rows={3}
                placeholder="Ask something wise..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button type="submit" className="flex justify-center items-center gap-2">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{loading ? "Thinking..." : "Send"}</span>
              </Button>
              {loading && <Button
                className="flex-1"
                variant="destructive"
                type="button"
                onClick={() => {
                  if (controller) controller.abort();
                }}
              >
                Stop
              </Button>}
            </form>
          </div>
        </Loader>
      </div>
    </div>
  );
};

export default HikamAI;
