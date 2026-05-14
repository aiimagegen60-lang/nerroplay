import { saveAs } from 'file-saver';

export async function convertToTxt(pdf: any, fileName: string, onProgress: (p: number) => void) {
  const numPages = pdf.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += `--- PAGE ${i} ---\n\n${pageText}\n\n`;
    onProgress(Math.round((i / numPages) * 100));
  }

  const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${fileName.replace(/\.pdf$/i, '')}.txt`);
}
