"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const SPECIAL = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function generateRandomKey(length: number, opts: { special: boolean; lower: boolean; upper: boolean; noDigits: boolean }) {
  let charset = '';
  if (!opts.noDigits) charset += DIGITS;
  if (opts.lower && !opts.upper) charset += LOWER;
  else if (opts.upper && !opts.lower) charset += UPPER;
  else if (opts.lower && opts.upper) charset += LOWER + UPPER;
  if (opts.special) charset += SPECIAL;
  if (!opts.lower && !opts.upper) charset += LOWER + UPPER; // fallback to all letters if none checked
  if (charset.length === 0) charset = LOWER + UPPER + DIGITS + SPECIAL;
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (x) => charset[x % charset.length]).join('');
}

const RandomKeyGenerator = () => {
  const [length, setLength] = useState(32);
  const [key, setKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [special, setSpecial] = useState(true);
  const [lower, setLower] = useState(false);
  const [upper, setUpper] = useState(false);
  const [noDigits, setNoDigits] = useState(false);
  const [warning, setWarning] = useState("");

  const handleGenerate = () => {
    if (length < 6 || length > 512) {
      setWarning("Key length must be between 6 and 512.");
      return;
    }
    setWarning("");
    setKey(generateRandomKey(length, { special, lower, upper, noDigits }));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (key) {
      await navigator.clipboard.writeText(key);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg mt-8 bg-background">
      <h2 className="text-xl font-bold mb-4">Random Key Generator</h2>
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="length" className="text-sm font-medium">Key Length:</label>
        <Input
          id="length"
          type="number"
          min={6}
          max={512}
          value={length}
          onChange={e => setLength(Number(e.target.value))}
          className="w-24"
        />
        <span className="text-xs text-muted-foreground">(6-512)</span>
      </div>
      {warning && (
        <div className="text-red-500 text-sm mb-2">{warning}</div>
      )}
      <div className="mb-4 flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={special} onChange={e => setSpecial(e.target.checked)} />
          <span>Include special character</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={lower} onChange={e => setLower(e.target.checked)} />
          <span>Lower case only</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} />
          <span>Upper case only</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={noDigits} onChange={e => setNoDigits(e.target.checked)} />
          <span>No digits</span>
        </label>
      </div>
      <Button onClick={handleGenerate} className="mb-4">Generate</Button>
      {key && (
        <div className="mt-4">
          <Textarea
            value={key}
            readOnly
            rows={3}
            className="font-mono text-base mb-2"
          />
          <Button variant="outline" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RandomKeyGenerator; 