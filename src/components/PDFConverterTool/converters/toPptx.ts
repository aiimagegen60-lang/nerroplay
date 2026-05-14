import pptxgen from 'pptxgenjs';

export async function convertToPptx(pdf: any, fileName: string, onProgress: (p: number) => void) {
  const pres = new pptxgen();
  const numPages = pdf.numPages;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context!, viewport }).promise;
    const imgData = canvas.toDataURL('image/png');

    const slide = pres.addSlide();
    slide.addImage({ 
      data: imgData, 
      x: 0, y: 0, 
      w: '100%', h: '100%'
    });

    onProgress(Math.round((i / numPages) * 100));
    
    // Memory cleanup
    canvas.width = 0;
    canvas.height = 0;
  }

  await pres.writeFile({ fileName: `${fileName.replace(/\.pdf$/i, '')}.pptx` });
}
