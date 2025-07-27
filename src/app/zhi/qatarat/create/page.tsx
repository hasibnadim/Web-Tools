"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, Save, UploadCloud, Maximize2, Minimize2 } from "lucide-react";
import { QATRAT_MAX_OVERVIEW_CHARACTERS, QATRAT_MAX_BODY_SIZE } from "@/service/qatrat/const";
import { cn } from "@/lib/utils";
import { Editor, loader } from "@monaco-editor/react";
import BWMarkdown from "@/components/BWMarkdown";
import { newQatrat } from "@/service/qatrat/action";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Loader from "@/components/Loader";

loader.config({
  paths: {
    vs: '/monaco/vs',
  },
})

// Utility function to get size in KB for comparison
const getSizeInKB = (characters: number): number => {
  return characters / 1024;
};

interface OverviewProps {
  overview: string;
  setOverview: (overview: string) => void;
  preview: boolean;
}
const Overview = ({ overview, setOverview, preview }: OverviewProps) => {
  if (preview) {
    return (
      <div className="bg-[#231a36]/90 rounded-xl p-6 border border-[#2d1e4d]">
        <BWMarkdown>
          {overview}
        </BWMarkdown>
      </div>
    );
  }
  return (
    <div>
      <Textarea
        value={overview}
        onChange={(e) => setOverview(e.target.value)}
        placeholder="# Your Title\nWrite a brief overview with **bold**, *italic*, ~~strikethrough~~, and [links](url)..."
        className="min-h-[80px] resize-none border border-[#2d1e4d] rounded-xl bg-[#231a36] focus:border-purple-500 focus:ring-2 focus:ring-purple-400 text-purple-100 text-base px-4 py-3 shadow-sm transition-all duration-200 placeholder-purple-400"
      />
    </div>
  );
};

interface BodyProps {
  body: string;
  setBody: (body: string) => void;
  preview: boolean;
  onToggleFullscreen: () => void;
}
const Body = ({ body, setBody, preview, onToggleFullscreen }: BodyProps) => {
  if (preview) {
    return (
      <div className="bg-[#231a36]/90 rounded-xl p-6 border border-[#2d1e4d] min-h-[65vh] overflow-y-auto">
        <BWMarkdown>
          {body}
        </BWMarkdown>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-purple-300">Editor</span>
          <div className="w-1 h-1 bg-purple-700 rounded-full"></div>
          <span className="text-sm text-purple-300">Markdown</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-sm border-[#2d1e4d] bg-[#231a36]/80 backdrop-blur-sm hover:bg-[#2d1e4d] shadow-sm text-purple-200"
          onClick={onToggleFullscreen}
        >
          <Maximize2 className="w-4 h-4" />
          Fullscreen
        </Button>
      </div>
      <div className="border border-[#2d1e4d] rounded-xl overflow-hidden shadow-sm bg-[#231a36]">
        <Editor
          height="65vh"
          width="100%"
          language="markdown"
          value={body}
          theme="vs-dark"
          onChange={(e) => setBody(e ?? "")}
          options={{
            minimap: { enabled: true },
            cursorBlinking: "smooth",
            fontSize: 14,
            lineHeight: 20,
            scrollBeyondLastLine: false,
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
};

export default function CreateQataratPage() {
  const [overview, setOverview] = useState("");
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [bodyEnabled, setBodyEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentUser, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  if (!isAuthenticated && !isLoading) {
    router.push('/auth/login');
  }

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const toggleBody = () => {
    setBodyEnabled(!bodyEnabled);
    if (!bodyEnabled) {
      // When enabling body, clear any existing content
      setBody("");
    }
  };

  const handleSaveDraft = async () => {
    if (!currentUser) {
      toast.error("Please login to create Qatarāt");
      return;
    }

    if (!overview.trim()) {
      toast.error("Overview is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await newQatrat({
        authorId: currentUser._id,
        overview: overview.trim(),
        body: bodyEnabled ? body.trim() : "",
        isPublic: false,
        isDraft: true,
      });

      toast.success("Draft saved successfully!");
      router.push(`/zhi/qatarat`);
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!currentUser) {
      toast.error("Please login to create Qatarāt");
      return;
    }

    if (!overview.trim()) {
      toast.error("Overview is required");
      return;
    }

    if (bodyEnabled && !body.trim()) {
      toast.error("Body content is required when enabled");
      return;
    }

    setIsSubmitting(true);
    try {
      await newQatrat({ 
        authorId: currentUser._id,
        overview: overview.trim(),
        body: bodyEnabled ? body.trim() : "",
        isPublic: true,
        isDraft: false,
      });

      toast.success("Qatarāh published successfully!");
      router.push(`/zhi/qatarat`);
    } catch (error) {
      console.error("Error publishing Qatarāh:", error);
      toast.error("Failed to publish Qatarāh. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const body = localStorage.getItem("q_body");
    if (body) {
      setBody(body);
    }
    const overview = localStorage.getItem("q_overview");
    if (overview) {
      setOverview(overview);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("q_body", body);
    localStorage.setItem("q_overview", overview);
  }, [body, overview]);
 

  return (
    <Loader isLoading={isLoading}>
      {/* Fullscreen Editor */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-[#181622]">
          <div className="absolute top-4 right-4 z-10">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-xs border-[#2d1e4d] bg-[#231a36]/90 backdrop-blur-sm shadow-lg text-purple-200"
              onClick={toggleFullscreen}
            >
              <Minimize2 className="w-4 h-4" />
              Exit Fullscreen
            </Button>
          </div>
          <div className="absolute top-4 left-4 z-10">
            <label className="block text-base font-semibold text-purple-100">
              Body Editor
            </label>
          </div>
          <div className="pt-16 px-4">
            <Editor
              height="calc(100vh - 80px)"
              width="100%"
              language="markdown"
              value={body}
              onChange={(e) => setBody(e ?? "")}
              options={{
                minimap: { enabled: true },
                cursorBlinking: "smooth",
                fontSize: 16,
                lineHeight: 24,
                theme: "vs-dark",
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={cn("min-h-screen bg-gradient-to-br from-[#181622] via-[#221a3a] to-[#2d1e4d]", fullscreen && "hidden")}>
        <div className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-1 bg-[#231a36] backdrop-blur-sm rounded-full px-2 py-1 mb-2 shadow-sm border border-[#2d1e4d]">
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              <span className="text-xs font-medium text-purple-200">أَضِفْ قَطْرَةً</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent mb-1">
              Add Qatarāh
            </h1>
          </div>

          {/* Main Editor Card */}
          <div className="bg-[#231a36]/95 rounded-xl sm:rounded-2xl shadow-xl border border-[#2d1e4d] overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#231a36] to-[#2d1e4d] px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-[#2d1e4d]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-purple-100 mb-1">Content Editor</h2>
                  <p className="text-xs sm:text-sm text-purple-300">Craft your Qatarāh with rich markdown support</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm border-[#2d1e4d] bg-[#231a36]/80 backdrop-blur-sm hover:bg-[#2d1e4d] text-purple-200"
                    onClick={() => setPreview((p) => !p)}
                  >
                    {preview ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                    <span className="hidden sm:inline">{preview ? "Edit" : "Preview"}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn("flex items-center gap-1 sm:gap-2 text-xs sm:text-sm border-[#2d1e4d] bg-[#231a36]/80 backdrop-blur-sm hover:bg-[#2d1e4d]",
                      bodyEnabled ? "border-green-400 bg-green-900/40 text-green-200" : "text-purple-300"
                    )}
                    onClick={toggleBody}
                  >
                    <span className="hidden sm:inline">{bodyEnabled ? "✓ Body Enabled" : "○ Enable Body"}</span>
                    <span className="sm:hidden">{bodyEnabled ? "✓" : "○"}</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Editor Content */}
            <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
              {/* Overview Section */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-700 to-blue-700 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-semibold">1</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-purple-100">Overview</h3>
                </div>
                <Overview overview={overview} setOverview={setOverview} preview={preview} />
                {!preview && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 sm:gap-3 text-purple-400">
                      <span className="font-medium">Markdown:</span>
                      <div className="flex items-center gap-1 sm:gap-2 font-mono text-xs">
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#231a36] rounded text-xs">#</span>
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#231a36] rounded text-xs">-</span>
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#231a36] rounded text-xs font-bold">**B**</span>
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#231a36] rounded text-xs italic">*i*</span>
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#231a36] rounded text-xs line-through">~~s~~</span>
                      </div>
                    </div>
                    <span className={cn("font-medium", {
                      "text-red-400": overview.length > QATRAT_MAX_OVERVIEW_CHARACTERS,
                      "text-green-400": overview.length < QATRAT_MAX_OVERVIEW_CHARACTERS,
                    })}>{overview.length}/{QATRAT_MAX_OVERVIEW_CHARACTERS} characters</span>
                  </div>
                )}
              </div>

              {/* Body Section */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-700 to-purple-700 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-semibold">2</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-purple-100">Body Content</h3>
                </div>

                {bodyEnabled ? (
                  <>
                    <Body body={body} setBody={setBody} preview={preview} onToggleFullscreen={toggleFullscreen} />
                    {!preview && !fullscreen && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-2 sm:gap-3 text-purple-400">
                          <span className="font-medium">Features:</span>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">LaTeX</span>
                            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">Code</span>
                            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">Tables</span>
                            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">Images</span>
                          </div>
                        </div>
                        <span className={cn("font-medium", {
                          "text-red-400": getSizeInKB(body.length) > QATRAT_MAX_BODY_SIZE,
                          "text-green-400": getSizeInKB(body.length) < QATRAT_MAX_BODY_SIZE,
                        })}>{getSizeInKB(body.length).toFixed(1)}/{QATRAT_MAX_BODY_SIZE} KB</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-gradient-to-br from-[#231a36] to-[#2d1e4d] rounded-xl p-6 sm:p-8 border border-[#2d1e4d] text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-700 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-xl sm:text-2xl text-purple-200">📝</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-purple-100 mb-2">Add Detailed Content</h4>
                    <p className="text-sm sm:text-base text-purple-300 mb-4 max-w-md mx-auto">
                      Enable body content to add rich markdown, LaTeX equations, code blocks, and more detailed information.
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="bg-[#231a36] border-[#2d1e4d] text-purple-200 hover:bg-[#2d1e4d]"
                      onClick={toggleBody}
                    >
                      Enable Body Content
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="bg-[#231a36]/80 px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-t border-[#2d1e4d]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-purple-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Auto-save enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Rich markdown support</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-gradient-to-r from-[#2d1e4d] to-[#231a36] hover:from-purple-800 hover:to-blue-800 text-white font-medium px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg shadow-sm text-xs sm:text-sm"
                    disabled={!overview.trim() || (bodyEnabled && (!body.trim() || overview.length > QATRAT_MAX_OVERVIEW_CHARACTERS || getSizeInKB(body.length) > QATRAT_MAX_BODY_SIZE)) || isSubmitting}
                    onClick={handleSaveDraft}
                  >
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Save Draft</span>
                    <span className="sm:hidden">Draft</span>
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white font-medium px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg shadow-sm text-xs sm:text-sm"
                    disabled={!overview.trim() || (bodyEnabled && (!body.trim() || overview.length > QATRAT_MAX_OVERVIEW_CHARACTERS || getSizeInKB(body.length) > QATRAT_MAX_BODY_SIZE)) || isSubmitting}
                    onClick={handlePublish}
                  >
                    <UploadCloud className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Publish Qatarāh</span>
                    <span className="sm:hidden">Publish</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loader>
  );
}