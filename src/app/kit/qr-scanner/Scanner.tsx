/* eslint-disable */
"use client"

import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React, { useRef, useState } from 'react'
import { decode } from './zxing-decoder';

const Scanner = () => {
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [base64Img, setBase64Img] = useState<string>("");
  const [decoded, setDecoded] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        const width = img.width;
        const height = img.height;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        setBase64Img(canvas.toDataURL());
        try {
          const result = await decode(canvas);
          setDecoded(result.text || JSON.stringify(result));
          setError("");
        } catch {
          setDecoded("");
          setError("Could not decode QR code. Please try another image.");
        }
      };
      img.onerror = () => {
        setError("Failed to load image.");
        setDecoded("");
      };
    }
  };

  return (
    <div className="qr-reader">
      <Input type='file' accept="image/*" onChange={handleFile} />
      <div ref={qrBoxEl} className="qr-box" id="reader">
        {base64Img && <Image src={base64Img} alt="QR Preview" width={200} height={200} />}
      </div>
      {decoded && (
        <div className="mt-4 p-2 border rounded bg-green-50 text-green-800">
          <b>Decoded Data:</b>
          <div className="break-all">{decoded}</div>
        </div>
      )}
      {error && (
        <div className="mt-4 p-2 border rounded bg-red-50 text-red-800">
          {error}
        </div>
      )}
    </div>
  );
}

export default Scanner