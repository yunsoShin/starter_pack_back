import * as crypto from "crypto";
import * as fs from "fs";

// 크기 반환
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// 확장자 추출
export const getFileExtension = (fileName: string): string => {
  return fileName.split(".").pop() || "";
};

// 파일 해시 계산
export const hashFile = (
  filePath: string,
  algorithm: string = "sha256"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const stream = fs.createReadStream(filePath);

    stream.on("data", (data) => hash.update(data));

    stream.on("end", () => resolve(hash.digest("hex")));

    stream.on("error", (err) => reject(err));
  });
};

// 해시 검증
export const verifyFileHash = async (
  filePath: string,
  expectedHash: string,
  algorithm: string = "sha256"
): Promise<boolean> => {
  const fileHash = await hashFile(filePath, algorithm);
  return fileHash === expectedHash;
};

// MIME 타입으로 PDF 여부 확인
export const isPdfByMimeType = (mimeType: string): boolean => {
  return mimeType === "application/pdf";
};

// 매직 넘버로 PDF 여부 확인
export const isPdfByMagicNumber = (filePath: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath, { start: 0, end: 4 });
    const pdfSignature = Buffer.from([0x25, 0x50, 0x44, 0x46]); // '%PDF'

    stream.on("data", (chunk) => {
      if (Buffer.isBuffer(chunk) && chunk.slice(0, 4).equals(pdfSignature)) {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    stream.on("error", (err) => reject(err));
  });
};


// PDF 파싱 함수 (pdf-parse 사용)
// const pdfParse = require("pdf-parse"); // pdf-parse는 require로 불러오기

// export async function parsePdfToText(pdfBuffer: Buffer): Promise<any> {
//   try {
//     const data = await pdfParse(pdfBuffer);

//     const text = data.text;

//     // 등기부등본의 고유번호와 소유지분현황을 파싱하는 로직
//     return text;
//   } catch (error) {
//     throw new Error(`PDF 파싱 실패: ${error.message}`);
//   }
// }

// 파싱된 텍스트에서 필요한 데이터 추출
