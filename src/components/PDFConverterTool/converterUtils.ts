import * as pdfjsLib from 'pdfjs-dist';
import { saveAs } from 'file-saver';

// Essential for PDF.js workers
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export const validateFile = (file: File) => {
  if (!file) throw new Error('No file selected');
  if (file.type !== 'application/pdf') throw new Error('Only PDF files are supported');
  if (file.size > 50 * 1024 * 1024) throw new Error('File too large. Max size is 50MB');
};

export const getPDFDocument = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  try {
    return await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  } catch (err) {
    throw new Error('CORRUPT_PDF: Failed to parse PDF document');
  }
};

export const enum STATUS {
  IDLE = 'idle',
  VALIDATING = 'validating',
  PARSING = 'parsing',
  CONVERTING = 'converting',
  DONE = 'done',
  ERROR = 'error'
}
