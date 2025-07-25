import { Banknote, Calculator, Code, File, Key, LetterText, LucideProps, QrCode, TypeOutline } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

const applications: Record<
  string,
  {
    name: string;
    link: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  }[]
> = {
  "General Kit": [
    {
      name: "Text Sharing",
      link: "/kit/share-text",
      icon: LetterText
    },
    {
      name: "File Sharing",
      link: "/kit/share-file",
      icon: File
    },
    {
      name: "QR Generator",
      link: "/kit/qrcode",
      icon: QrCode
    },
    // {
    //   name: "QR/Barcode Scanner",
    //   link: "/kit/qr-scanner",
    // },

  ],
  "Conversion Kit": [
    {
      name: "Mobile Banking",
      link: "/kit/mobile-banking",
      icon: Banknote
    },
    {
      name: "Byte Converter",
      link: "/kit/byte-converter",
      icon: Calculator
    },
  ],
  "Developer Suite": [
    {
      name: "String/JSON Size Calculator",
      link: "/kit/json-size-calculator",
      icon: Code
    },
    {
      name: "Text Diff Checker",
      link: "/kit/text-diff-checker",
      icon: TypeOutline
    },
    {
      name: "Random Key Generator",
      link: "/kit/random-key-generator",
      icon: Key
    },
  ],
};

export default applications;
