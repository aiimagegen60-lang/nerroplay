import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function convertToPng(pdf: any, fileName: string, onProgress: (p: number) => void) {
  const numPages = pdf.numPages;
  const zip = new JSZip();

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context!, viewport }).promise;
    const imgData = canvas.toDataURL('image/png').split(',')[1];
    
    zip.file(`page_${i}.png`, imgData, { base64: true });
    onProgress(Math.round((i / numPages) * 100));

    // Cleanup
    canvas.width = 0;
    canvas.height = 0;
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${fileName.replace(/\.pdf$/i, '')}_images.zip`);
}
