"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const units = [
  { label: "Bit", value: "bit", factor: 1 / 8 },
  { label: "Byte", value: "byte", factor: 1 },
  { label: "Kilobyte (KB)", value: "kb", factor: 1024 },
  { label: "Megabyte (MB)", value: "mb", factor: 1024 * 1024 },
  { label: "Gigabyte (GB)", value: "gb", factor: 1024 * 1024 * 1024 },
  { label: "Terabyte (TB)", value: "tb", factor: 1024 ** 4 },
  { label: "Petabyte (PB)", value: "pb", factor: 1024 ** 5 },
];

function convert(value: number, from: string, to: string) {
  const fromUnit = units.find(u => u.value === from);
  const toUnit = units.find(u => u.value === to);
  if (!fromUnit || !toUnit) return 0;
  // Convert input to bytes, then to output unit
  const bytes = value * fromUnit.factor;
  return bytes / toUnit.factor;
}

const ByteConverter = () => {
  const [input, setInput] = useState("1");
  const [from, setFrom] = useState("byte");
  const [to, setTo] = useState("kb");
  const [copied, setCopied] = useState(false);

  const result = convert(Number(input), from, to);
  const resultFormatted = result.toLocaleString('en-US', { 
    maximumFractionDigits: 6,
    minimumFractionDigits: 0 
  });

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(`${resultFormatted} ${units.find(u => u.value === to)?.label}`);
      setCopied(true);
      toast.success('Result copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy result');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-lg border border-slate-800">
              <Calculator className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-medium text-gray-200">Data Conversion</span>
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent mb-2">
              Byte Converter
            </h1>
            
            <p className="text-base text-gray-400">
              Convert between different data storage units
            </p>
          </div>

          {/* Converter Card */}
          <Card className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-100">
                <div className="p-1.5 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-lg">
                  <Calculator className="h-4 w-4 text-white" />
                </div>
                Convert Units
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Input Section */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={input}
                    min={0}
                    onChange={e => setInput(e.target.value)}
                    className="h-10 text-sm border-2 border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-900 bg-slate-800 text-gray-100 placeholder:text-gray-400 transition-all duration-200"
                    placeholder="Enter value"
                  />
                </div>
                <Select value={from} onValueChange={setFrom}>
                  <SelectTrigger className="w-40 h-10 text-sm bg-slate-800 border border-slate-700 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-gray-100">
                    {units.map(u => (
                      <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="p-2 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-full">
                  <ArrowRight className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Output Section */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Select value={to} onValueChange={setTo}>
                    <SelectTrigger className="w-40 h-10 text-sm bg-slate-800 border border-slate-700 text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-gray-100">
                      {units.map(u => (
                        <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Result */}
              <div className="bg-gradient-to-r from-blue-900/80 to-indigo-900/80 p-4 rounded-lg border border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Result</p>
                    <p className="text-lg font-mono font-bold text-blue-200">
                      {resultFormatted} {units.find(u => u.value === to)?.label}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyResult}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-blue-400"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Conversions */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Quick Conversions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { from: "1", fromUnit: "mb", to: "kb" },
                { from: "1", fromUnit: "gb", to: "mb" },
                { from: "1024", fromUnit: "kb", to: "mb" },
                { from: "1", fromUnit: "tb", to: "gb" }
              ].map((quick, index) => {
                const quickResult = convert(Number(quick.from), quick.fromUnit, quick.to);
                return (
                  <div key={index} className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-400">{quick.from} {units.find(u => u.value === quick.fromUnit)?.label}</p>
                    <p className="text-sm font-semibold text-blue-200">= {quickResult.toLocaleString()} {units.find(u => u.value === quick.to)?.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ByteConverter;
