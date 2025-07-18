"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCompare, ArrowRight, Copy, Check, FileText, Code, Maximize, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";

// Function to highlight character differences within a line (move to top-level)
function highlightCharacterDiff(oldLine: string, newLine: string, isOriginal: boolean) {
  if (oldLine === newLine) {
    return <span>{oldLine}</span>;
  }
  const oldChars = oldLine.split('');
  const newChars = newLine.split('');
  const maxCharLen = Math.max(oldChars.length, newChars.length);
  return (
    <span>
      {Array.from({ length: maxCharLen }).map((_, i) => {
        const oldChar = oldChars[i];
        const newChar = newChars[i];
        if (oldChar === newChar) {
          return <span key={i}>{oldChar || ''}</span>;
        } else if (oldChar && !newChar) {
          // Character was removed (only show in original)
          return isOriginal ? (
            <span key={i} className="bg-yellow-200 text-yellow-800 px-0.5 rounded shadow-sm">{oldChar}</span>
          ) : null;
        } else if (!oldChar && newChar) {
          // Character was added (only show in modified)
          return !isOriginal ? (
            <span key={i} className="bg-yellow-200 text-yellow-800 px-0.5 rounded shadow-sm">{newChar}</span>
          ) : null;
        } else {
          // Character was changed
          return (
            <span key={i} className="bg-yellow-200 text-yellow-800 px-0.5 rounded shadow-sm">{isOriginal ? oldChar : newChar}</span>
          );
        }
      })}
    </span>
  );
}

// Side-by-side comparison like VSCode with line numbers and proper formatting
function getSideBySideDiffWithCollapse(
  oldText: string,
  newText: string,
  expandedBlocks: Set<string>,
  setExpandedBlocks: (cb: (prev: Set<string>) => Set<string>) => void
): React.ReactNode {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");
  const maxLen = Math.max(oldLines.length, newLines.length);
  const context = 2; // lines of context before/after changes

  // Helper to find changed lines
  const changed = Array.from({ length: maxLen }).map((_, i) => (oldLines[i] ?? "") !== (newLines[i] ?? ""));

  // Find blocks to collapse
  const blocks: Array<{ type: "changed" | "unchanged", start: number, end: number }> = [];
  let i = 0;
  while (i < maxLen) {
    if (changed[i]) {
      let j = i;
      while (j < maxLen && changed[j]) j++;
      blocks.push({ type: "changed", start: i, end: j - 1 });
      i = j;
    } else {
      let j = i;
      while (j < maxLen && !changed[j]) j++;
      blocks.push({ type: "unchanged", start: i, end: j - 1 });
      i = j;
    }
  }

  // Render blocks with context and collapse
  const rows: React.ReactNode[] = [];
  for (const block of blocks) {
    if (block.type === "changed") {
      for (let k = block.start; k <= block.end; ++k) {
        const oldLine = oldLines[k] ?? "";
        const newLine = newLines[k] ?? "";
        const hasChanged = oldLine !== newLine;
        const lineNumber = k + 1;
        rows.push(
          <div key={"changed-" + k} className="grid grid-cols-2 gap-0 font-mono text-xs">
            {/* Original */}
            <div className={`flex items-start transition-all duration-200 hover:bg-gray-50/50 ${hasChanged ? (oldLine ? 'bg-gradient-to-r from-red-50/80 to-red-100/40 border-l-2 border-red-400 shadow-sm' : '') : ''}`}> 
              <div className="w-12 px-2 py-1 text-xs text-gray-500 bg-gradient-to-r from-gray-50 to-gray-100/50 border-r border-gray-200/60 select-none font-medium">{lineNumber}</div>
              <div className="flex-1 py-1 px-3 whitespace-pre overflow-x-auto leading-tight">{highlightCharacterDiff(oldLine, newLine, true)}</div>
            </div>
            {/* Modified */}
            <div className={`flex items-start transition-all duration-200 hover:bg-gray-50/50 ${hasChanged ? (newLine ? 'bg-gradient-to-r from-green-50/80 to-green-100/40 border-l-2 border-green-400 shadow-sm' : '') : ''}`}> 
              <div className="w-12 px-2 py-1 text-xs text-gray-500 bg-gradient-to-r from-gray-50 to-gray-100/50 border-r border-gray-200/60 select-none font-medium">{lineNumber}</div>
              <div className="flex-1 py-1 px-3 whitespace-pre overflow-x-auto leading-tight">{highlightCharacterDiff(oldLine, newLine, false)}</div>
            </div>
          </div>
        );
      }
    } else {
      // Unchanged block
      const blockLen = block.end - block.start + 1;
      const blockKey = `unchanged-${block.start}-${block.end}`;
      const showAll = expandedBlocks.has(blockKey);
      const showStart = block.start;
      const showEnd = block.end;
      const visible: number[] = [];
      if (showAll || blockLen <= context * 2) {
        for (let k = showStart; k <= showEnd; ++k) visible.push(k);
      } else {
        for (let k = showStart; k < showStart + context; ++k) visible.push(k);
        for (let k = showEnd - context + 1; k <= showEnd; ++k) visible.push(k);
      }
      // Render visible lines
      visible.forEach((k) => {
        const oldLine = oldLines[k] ?? "";
        const newLine = newLines[k] ?? "";
        const lineNumber = k + 1;
        rows.push(
          <div key={"unchanged-" + k} className="grid grid-cols-2 gap-0 font-mono text-xs">
            <div className="flex items-start">
              <div className="w-12 px-2 py-1 text-xs text-gray-400 bg-gradient-to-r from-gray-50 to-gray-100/50 border-r border-gray-200/60 select-none font-medium">{lineNumber}</div>
              <div className="flex-1 py-1 px-3 whitespace-pre overflow-x-auto leading-tight">{oldLine}</div>
            </div>
            <div className="flex items-start">
              <div className="w-12 px-2 py-1 text-xs text-gray-400 bg-gradient-to-r from-gray-50 to-gray-100/50 border-r border-gray-200/60 select-none font-medium">{lineNumber}</div>
              <div className="flex-1 py-1 px-3 whitespace-pre overflow-x-auto leading-tight">{newLine}</div>
            </div>
          </div>
        );
      });
      // Render collapse button if needed
      if (!showAll && blockLen > context * 2) {
        rows.push(
          <div key={"collapse-" + blockKey} className="col-span-2 flex items-center justify-center text-xs text-gray-500 py-1">
            <button
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 border border-gray-200 shadow-sm transition-all"
              onClick={() => setExpandedBlocks(prev => new Set([...prev, blockKey]))}
            >
              <ChevronDown className="h-3 w-3" />
              Show {blockLen - context * 2} more unchanged line{blockLen - context * 2 > 1 ? 's' : ''}
            </button>
          </div>
        );
      }
    }
  }

  // Render as a single list of rows
  return <div>{rows}</div>;
}

export default function TextDiffChecker() {
    const [oldText, setOldText] = useState("");
    const [newText, setNewText] = useState("");
    const [copied, setCopied] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());

 
    const handleCopy = async () => {
        const textContent = oldText + "\n\n--- DIFF ---\n\n" + newText;
        try {
            await navigator.clipboard.writeText(textContent);
            setCopied(true);
            toast.success('Diff copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Failed to copy diff');
        }
    };

    // Always compute diff in render so expanding/collapsing works
    const diffResult = getSideBySideDiffWithCollapse(
      oldText,
      newText,
      expandedBlocks,
      setExpandedBlocks
    );

    // Fullscreen overlay for diff view
    const FullscreenDiff = () => (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="relative w-full h-full max-h-screen max-w-screen-2xl flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 bg-white/95 border-b border-gray-200/60 rounded-t-lg shadow-lg">
                    <div className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-blue-600" />
                        <span className="font-bold text-base text-gray-900">Side by Side Comparison</span>
                        <span className="text-xs text-gray-500 ml-2">Character-level precision</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setFullscreen(false)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        aria-label="Close fullscreen"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex-1 bg-white/95 rounded-b-lg overflow-auto p-0">
                    <ScrollArea className="h-full w-full min-h-0 min-w-0 border-0 rounded-none bg-transparent smooth-scrollbar">
                        {diffResult}
                    </ScrollArea>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 py-6">
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">

                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-lg">
                            <GitCompare className="h-3.5 w-3.5 text-blue-500" />
                            <span className="text-xs font-medium text-gray-700">Advanced Text Analysis</span>
                        </div>

                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-1">
                            Text Diff Checker
                        </h1>

                        <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Compare and visualize differences between two text versions with precision down to the character level
                        </p>
                    </div>

                    {/* Input Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Original Text */}
                        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-200">
                                        <FileText className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <div>Original Text</div>
                                        <div className="text-xs font-normal text-gray-500">Source content</div>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={oldText}
                                    onChange={(e) => setOldText(e.target.value)}
                                    placeholder="Paste your original text here..."
                                    rows={12}
                                    className="text-sm border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-200/50 transition-all duration-200 resize-none font-mono bg-white/80 backdrop-blur-sm shadow-inner"
                                />
                            </CardContent>
                        </Card>

                        {/* Modified Text */}
                        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-200">
                                        <Code className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <div>Modified Text</div>
                                        <div className="text-xs font-normal text-gray-500">Updated content</div>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={newText}
                                    onChange={(e) => setNewText(e.target.value)}
                                    placeholder="Paste your modified text here..."
                                    rows={12}
                                    className="text-sm border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-200/50 transition-all duration-200 resize-none font-mono bg-white/80 backdrop-blur-sm shadow-inner"
                                />
                            </CardContent>
                        </Card>
                    </div>

        

                    {/* Diff Result */}
                    {diffResult && (
                        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center justify-between text-lg font-bold text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                                            <ArrowRight className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <div>Side by Side Comparison</div>
                                            <div className="text-xs font-normal text-gray-500">Character-level precision</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setFullscreen(true)}
                                            className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                            aria-label="Fullscreen"
                                        >
                                            <Maximize className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleCopy}
                                            className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                        >
                                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-96 border border-gray-200/60 rounded-lg bg-white/80 backdrop-blur-sm shadow-inner smooth-scrollbar">
                                    {diffResult}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    )}
                    {fullscreen && <FullscreenDiff />}
                    {/* Info Card */}
                    <div className="mt-6">
                        <Card className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                                        <GitCompare className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 mb-2">How it works</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                                    <span className="text-xs font-medium text-gray-700">Red highlighted lines</span>
                                                </div>
                                                <p className="text-xs text-gray-600 ml-4">Show removed content</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                    <span className="text-xs font-medium text-gray-700">Green highlighted lines</span>
                                                </div>
                                                <p className="text-xs text-gray-600 ml-4">Show added content</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                                    <span className="text-xs font-medium text-gray-700">Yellow highlighted characters</span>
                                                </div>
                                                <p className="text-xs text-gray-600 ml-4">Show exact character changes</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                    <span className="text-xs font-medium text-gray-700">Line numbers</span>
                                                </div>
                                                <p className="text-xs text-gray-600 ml-4">Track changes across versions</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
