"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

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

  const result = convert(Number(input), from, to);

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg mt-8 bg-background">
      <h2 className="text-xl font-bold mb-4">Byte Converter</h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={input}
            min={0}
            onChange={e => setInput(e.target.value)}
            className="w-32"
          />
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {units.map(u => (
                <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="mx-2">to</span>
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {units.map(u => (
                <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 text-lg font-mono">
          Result: <span className="font-bold">{result}</span> {units.find(u => u.value === to)?.label}
        </div>
      </div>
    </div>
  );
};

export default ByteConverter;
