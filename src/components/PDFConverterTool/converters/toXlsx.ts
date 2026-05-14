import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export async function convertToXlsx(pdf: any, fileName: string, onProgress: (p: number) => void) {
  const workbook = new ExcelJS.Workbook();
  const numPages = pdf.numPages;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const sheet = workbook.addWorksheet(`Page ${i}`);

    // Robust row detection by Y coordinate
    const rows: Record<number, any[]> = {};
    textContent.items.forEach((item: any) => {
      const y = Math.round(item.transform[5]);
      if (!rows[y]) rows[y] = [];
      rows[y].push({ x: item.transform[4], str: item.str });
    });

    const sortedY = Object.keys(rows).map(Number).sort((a, b) => b - a);
    sortedY.forEach(y => {
      const rowData = rows[y].sort((a, b) => a.x - b.x).map(item => item.str);
      sheet.addRow(rowData);
    });

    onProgress(Math.round((i / numPages) * 100));
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${fileName.replace(/\.pdf$/i, '')}.xlsx`);
}
