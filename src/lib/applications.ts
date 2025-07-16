const applications: Record<
  string,
  {
    name: string;
    link: string;
  }[]
> = {
  
  "Generator Kit": [
    {
      name: "QR/Barcode Generator",
      link: "/kit/qrcode",
    },
    // {
    //   name: "QR/Barcode Scanner",
    //   link: "/kit/qr-scanner",
    // },
    {
      name: "Random Key Generator",
      link: "/kit/random-key-generator",
    }
  ],
  "Conversion Kit": [{
    name: "Byte Converter",
    link: "/kit/byte-converter",
  }],
  "Developer Suite": [
    {
      name: "String/JSON Size Calculator",
      link: "/kit/json-size-calculator",
    }
  ],
};

export default applications;
