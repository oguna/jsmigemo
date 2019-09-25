
export class CompactHiraganaString {
    public static decodeBytes(bytes: Uint8Array): string {
        let result = "";
        for (let i = 0; i < bytes.length; i++) {
            result += CompactHiraganaString.decodeByte(bytes[i]);
        }
        return result;
    }

    public static decodeByte(c: number): string {
        if (0x20 <= c && c <= 0x7e) {
            return String.fromCharCode(c);
        }
        if (0xa1 <= c && c <= 0xf6) {
            return String.fromCharCode(c + 0x3040 - 0xa0);
        }
        throw new RangeError();
    }

    public static encodeString(str: string): Uint8Array {
        const result = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
            result[i] = CompactHiraganaString.encodeChar(str.charCodeAt(i));
        }
        return result;
    }

    public static encodeChar(b: number): number {
        if (b == 0) {
            return 0;
        }
        if (0x20 <= b && b <= 0x7e) {
            return b;
        }
        if (0x3041 <= b && b <= 0x3096) {
            return b - 0x3040 + 0xa0;
        }
        if (0x30fc === b) {
            return b - 0x3040 + 0xa0;
        }
        throw new RangeError('unknown character to encode: ' + b);
    }
}