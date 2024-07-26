'use client';

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { PDFViewer } from "@react-pdf/renderer";
import { Document, Page } from "@react-pdf/renderer";
import { Button } from "./ui/button";




const PdfView = ({ url }: { url: string }) => {
  return (
    <div>
    <h1>File Details</h1>
    <PdfView url={url} />
  </div>
  );
};

export default PdfView;

