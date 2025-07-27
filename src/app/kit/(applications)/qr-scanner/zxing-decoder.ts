export async function decode(canvas: HTMLCanvasElement) {
    const ZXingModule = await import("./third_party/zxing-js.umd.js");
    const ZXing = ZXingModule.default || ZXingModule;
    const zxingDecoder = new ZXing.MultiFormatReader(false, {});
    const luminanceSource = new ZXing.HTMLCanvasElementLuminanceSource(canvas);
    const binaryBitmap = new ZXing.BinaryBitmap(
        new ZXing.HybridBinarizer(luminanceSource)
    );
    const result = zxingDecoder.decode(binaryBitmap);
    return result;
}
