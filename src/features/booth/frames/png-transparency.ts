import { inflateSync } from "node:zlib";

const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

/**
 * Memastikan data adalah PNG non-interlaced yang valid dan memiliki setidaknya
 * satu pixel transparan.
 *
 * @param data - Isi file PNG.
 * @returns `true` jika file valid dan mempunyai transparansi.
 */
export function hasPngTransparency(data: Buffer): boolean {
  if (data.length < 33 || !data.subarray(0, 8).equals(signature)) return false;

  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = -1;
  let interlace = 0;
  const imageData: Buffer[] = [];
  let transparency: Buffer | undefined;
  let offset = 8;

  while (offset + 12 <= data.length) {
    const length = data.readUInt32BE(offset);
    if (length > data.length - offset - 12) return false;
    const type = data.toString("ascii", offset + 4, offset + 8);
    const chunk = data.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      if (length !== 13) return false;
      width = chunk.readUInt32BE(0);
      height = chunk.readUInt32BE(4);
      bitDepth = chunk[8]!;
      colorType = chunk[9]!;
      interlace = chunk[12]!;
    } else if (type === "IDAT") imageData.push(chunk);
    else if (type === "tRNS") transparency = chunk;
    offset += length + 12;
    if (type === "IEND") break;
  }

  if (!width || !height || width * height > 40_000_000 || interlace !== 0 || imageData.length === 0) return false;
  if (![0, 2, 3, 4, 6].includes(colorType)) return false;
  if (colorType === 3) return !!transparency?.some((alpha) => alpha < 255);
  if (colorType === 0 || colorType === 2) return !!transparency;

  const channels = colorType === 6 ? 4 : 2;
  if (![8, 16].includes(bitDepth)) return false;
  const bytesPerSample = bitDepth / 8;
  const bytesPerPixel = channels * bytesPerSample;
  const rowLength = width * bytesPerPixel;
  const inflated = inflateSync(Buffer.concat(imageData), { maxOutputLength: (rowLength + 1) * height });
  if (inflated.length !== (rowLength + 1) * height) return false;

  let previous = Buffer.alloc(rowLength);
  let cursor = 0;
  for (let y = 0; y < height; y++) {
    const filter = inflated[cursor++]!;
    const row = Buffer.from(inflated.subarray(cursor, cursor + rowLength));
    cursor += rowLength;
    for (let i = 0; i < rowLength; i++) {
      const left = i >= bytesPerPixel ? row[i - bytesPerPixel]! : 0;
      const above = previous[i]!;
      const upperLeft = i >= bytesPerPixel ? previous[i - bytesPerPixel]! : 0;
      if (filter === 1) row[i] = (row[i]! + left) & 255;
      else if (filter === 2) row[i] = (row[i]! + above) & 255;
      else if (filter === 3) row[i] = (row[i]! + Math.floor((left + above) / 2)) & 255;
      else if (filter === 4) {
        const p = left + above - upperLeft;
        const pa = Math.abs(p - left), pb = Math.abs(p - above), pc = Math.abs(p - upperLeft);
        row[i] = (row[i]! + (pa <= pb && pa <= pc ? left : pb <= pc ? above : upperLeft)) & 255;
      } else if (filter !== 0) return false;
    }
    const alphaOffset = channels === 4 ? 3 * bytesPerSample : bytesPerSample;
    const maxAlpha = bitDepth === 8 ? 255 : 65535;
    for (let i = alphaOffset; i < rowLength; i += bytesPerPixel) {
      const alpha = bitDepth === 8 ? row[i]! : row.readUInt16BE(i);
      if (alpha < maxAlpha) return true;
    }
    previous = row;
  }
  return false;
}
