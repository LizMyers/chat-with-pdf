// app/components/Documents.tsx
interface Document {
  name: string;
  url: string;
}

interface DocumentsProps {
  documents: Document[];
}

function Documents({ documents }: DocumentsProps) {
  return (
    <div>
      {documents.map(doc => (
        <div key={doc.name} className="p-4 bg-white rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-bold">{doc.name}</h2>
          <a href={doc.url} target="_blank" rel="noopener noreferrer">Open Document</a>
        </div>
      ))}
    </div>
  );
}

export default Documents;