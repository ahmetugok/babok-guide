const MAX_CHARS = 15000;

function readAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Dosya okunamadı.'));
    reader.readAsText(file, 'UTF-8');
  });
}

async function readPdf(file) {
  const pdfjsLib = await import('pdfjs-dist');
  const workerUrl = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url);
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl.href;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    pages.push(pageText);
  }

  return pages.join('\n');
}

export async function readFileAsText(file) {
  const ext = file.name.split('.').pop().toLowerCase();

  let text;
  if (ext === 'pdf') {
    text = await readPdf(file);
  } else {
    text = await readAsText(file);
  }

  return text.slice(0, MAX_CHARS);
}
