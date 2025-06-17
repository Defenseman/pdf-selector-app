import { useSearchParams } from 'react-router-dom';
import { PdfViewer } from './components/PdfViewer';

function App() {
  const [searchParams] = useSearchParams();
  const fileName = searchParams.get('fileName');

  const fileUrl = fileName ? `/pdfs/${fileName}` : '';

  return (
    <div>
      <h1>PDF Viewer</h1>
      {fileUrl ? (
        <PdfViewer fileUrl={fileUrl} />
      ) : (
        <p>Не передан параметр fileName в URL</p>
      )}
    </div>
  );
}

export default App;