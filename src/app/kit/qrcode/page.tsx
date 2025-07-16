import QRapp from "@/components/QRapp";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "QR Code Generator/Scanner",
    description: "Generate/Scan QR Code",
  };
  
export default function Home() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
        

       <QRapp /> 
    </div>
  );
}
