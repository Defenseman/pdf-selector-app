import { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import '../pdfWorker/pdfWorker';
import { PdfPage } from './PdfPage';
import { FragmentList } from './FragmentList';
import { v4 } from 'uuid';
import { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';

interface Props {
  fileUrl: string;
}

export const PdfViewer = ({ fileUrl }: Props) => {
  const [pages, setPages] = useState<PDFPageProxy[]>([]);

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
    };
    renderPDF();
  }, [fileUrl]);

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
          {pages.map((page) => (
            <PdfPage key={v4()} page={page} />
          ))}
      </div>

      <div style={{ flex: 1 }}>
          <h2 style={{margin: '0 0 10px'}}>Fragments:</h2>
          <FragmentList />
      </div>
    </div>
  );
};
