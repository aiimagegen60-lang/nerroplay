import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export async function convertToDocx(pdf: any, fileName: string, onProgress: (p: number) => void) {
  const numPages = pdf.numPages;
  const sections = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Simple grouping by Y to maintain some paragraph structure
    const lines: Record<number, string[]> = {};
    textContent.items.forEach((item: any) => {
      const y = Math.round(item.transform[5]);
      if (!lines[y]) lines[y] = [];
      lines[y].push(item.str);
    });

    const sortedY = Object.keys(lines).map(Number).sort((a, b) => b - a);
    const paragraphs = sortedY.map(y => new Paragraph({
      children: [new TextRun(lines[y].join(' '))],
    }));

    sections.push({
      properties: { pageBreakBefore: i > 1 },
      children: paragraphs,
    });

    onProgress(Math.round((i / numPages) * 100));
  }

  const doc = new Document({
    title: fileName,
    creator: 'NerroPlay PDF Converter',
    sections: sections
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${fileName.replace(/\.pdf$/i, '')}.docx`);
}
