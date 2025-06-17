import { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import '../pdfWorker/pdfWorker';
import { PdfPage } from './PdfPage';
import { FragmentList } from './FragmentList';

interface Props {
  fileUrl: string;
}

export const PdfViewer = ({ fileUrl }: Props) => {
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<any[]>([]);
  const [fragments, setFragmets] = useState<string[]>([]);

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

  const handleFragmentsAdd = (base64: string ) => {
    setFragmets(prev => [...prev, base64])
  }

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        {loading && <p>Загрузка PDF...</p>}
          {pages.map((page, index) => (
            <PdfPage 
              key={Math.random() * 100} 
              page={page} 
              pageNum={index + 1} 
              onApplyFragment={handleFragmentsAdd} />
          ))}
      </div>

      <div style={{ flex: 1 }}>
          <h3>Fragments</h3>
          <FragmentList fragments={fragments} />
      </div>
    </div>
  );
};
