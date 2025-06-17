import { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import '../pdfWorker/pdfWorker';
import { PdfPage } from './PdfPage';

interface Props {
  fileUrl: string;
}

export const PdfViewer = ({ fileUrl }: Props) => {
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<any[]>([]);

  useEffect(() => {
    const renderPDF = async () => {
      const loadingTask = pdfjsLib.getDocument(fileUrl);
      const pdf = await loadingTask.promise;

      const pageList = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        pageList.push(page);
      };
        setPages(pageList)
        setLoading(false);
    };
    renderPDF();
  }, [fileUrl]);

  console.log(pages);


  return (
    <div>
      {loading && <p>Загрузка PDF...</p>}
      <div>{pages.map((page, index) => (
        <PdfPage key={Math.random() * 100} page={page} pageNum={index + 1} />
      ))}</div>
    </div>
  );
};
