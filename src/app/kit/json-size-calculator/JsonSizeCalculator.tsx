"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"; 
import JsonToTS from "json-to-ts";

function getByteSize(str: string) {
  return new Blob([str]).size;
}

function isValidJson(str: string) {
  try {
    const parsed = JSON.parse(str);
    // Only allow objects/arrays as valid JSON
    return typeof parsed === "object" && parsed !== null;
  } catch {
    return false;
  }
}

function isValidJsObject(str: string) {
  try {
    // eslint-disable-next-line no-eval
    const obj = eval('(' + str + ')');
    return typeof obj === "object" && obj !== null;
  } catch {
    return false;
  }
}

function toTypeScriptInterface(obj: unknown): string {
  let result = "";
  JsonToTS(obj).forEach( typeInterface => {
    result += typeInterface + "\n";
  })
  return result;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`;
  const units = ["KB", "MB", "GB", "TB"];
  let i = -1;
  do {
    bytes = bytes / 1024;
    i++;
  } while (bytes >= 1024 && i < units.length - 1);
  return `${bytes.toFixed(2)} ${units[i]}`;
}

function roughSizeOfObject(object: unknown, visited = new Set()): number {
  if (object === null || object === undefined) return 0;
  if (visited.has(object)) return 0;
  visited.add(object);
  let bytes = 0;
  switch (typeof object) {
    case "number":
      bytes += 8;
      break;
    case "string":
      bytes += object.length * 2;
      break;
    case "boolean":
      bytes += 4;
      break;
    case "object":
      if (Array.isArray(object)) {
        for (const item of object) {
          bytes += roughSizeOfObject(item, visited);
        }
      } else {
        for (const key in object as Record<string, unknown>) {
          if (Object.prototype.hasOwnProperty.call(object, key)) {
            bytes += key.length * 2;
            bytes += roughSizeOfObject((object as Record<string, unknown>)[key], visited);
          }
        }
      }
      break;
    default:
      break;
  }
  return bytes;
}

const JsonSizeCalculator = () => {
  const [input, setInput] = useState("");
  const [tsInterface, setTsInterface] = useState("");
  const [error, setError] = useState("");

  const isJson = isValidJson(input);
  const isJsObj = !isJson && isValidJsObject(input);
  const charLength = input.length;
  const byteSize = getByteSize(input);
  let objectSize = 0;
  if (isJsObj) {
    try {
      // eslint-disable-next-line no-eval
      const obj = eval('(' + input + ')');
      objectSize = roughSizeOfObject(obj);
    } catch {}
  }

  const handleMinify = () => {
    try {
      const minified = JSON.stringify(JSON.parse(input));
      setInput(minified);
    } catch {}
  };

  const handleGenerateInterface = () => {
    setError("");
    try {
      let obj;
      if (isJson) {
        obj = JSON.parse(input);
      } else if (isJsObj) {
        // eslint-disable-next-line no-eval
        obj = eval('(' + input + ')');
      } else {
        setError("Input is not valid JSON or JS object.");
        setTsInterface("");
        return;
      }
      setTsInterface(toTypeScriptInterface(obj));
    } catch {
      setError("Failed to generate interface.");
      setTsInterface("");
    }
  };

  const handleConvertToJson = () => {
    setError("");
    try {
      // eslint-disable-next-line no-eval
      const obj = eval('(' + input + ')');
      setInput(JSON.stringify(obj, null, 2));
    } catch {
      setError("Failed to convert JS object to JSON.");
    }
  };

  const handleConvertToJsObject = () => {
    setError("");
    try {
      const obj = JSON.parse(input);
      // Convert to JS object string (not minified)
      setInput(JSON.stringify(obj, null, 2)
        .replace(/"([^("]+)":/g, '$1:') // remove quotes from keys
        .replace(/"/g, "'")); // use single quotes for values
    } catch {
      setError("Failed to convert JSON to JS object.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-lg mt-8 bg-background">
      <h2 className="text-xl font-bold mb-4">String/JSON Size Calculator</h2>
      <Textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={8}
        placeholder="Paste your string, JSON, or JS object here..."
        className="mb-4 font-mono"
      />
      <div className="mb-2 text-sm">Character Length: <b>{charLength}</b></div>
      <div className="mb-4 text-sm">Byte Size: <b>{byteSize}</b> bytes</div>
      {isJsObj && (
        <div className="mb-4 text-sm">Object Size (approx): <b>{formatBytes(objectSize)}</b></div>
      )}
      {(isJson || isJsObj) && (
        <div className="flex gap-2 mb-2 flex-wrap">
          {isJson && <Button variant="outline" onClick={handleMinify}>Minify JSON</Button>}
          <Button variant="outline" onClick={handleGenerateInterface}>Generate Interface</Button>
          {isJsObj && <Button variant="outline" onClick={handleConvertToJson}>Convert to JSON</Button>}
          {isJson && <Button variant="outline" onClick={handleConvertToJsObject}>Convert to JS Object</Button>}
        </div>
      )}
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {tsInterface && (
        <Textarea
          value={tsInterface}
          readOnly
          rows={Math.max(4, tsInterface.split("\n").length)}
          className="font-mono mt-2"
        />
      )}
    </div>
  );
};

export default JsonSizeCalculator; 