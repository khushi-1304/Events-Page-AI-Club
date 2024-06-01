import { useCallback, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import "./magazinePage.css";
import samplePdf from './sample.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const resizeObserverOptions = {};

const maxWidth = 800;

export default function Sample() {
  const [file] = useState(samplePdf);
  const [numPages, setNumPages] = useState();
  const [containerRef, setContainerRef] = useState(null);
  const [containerWidth, setContainerWidth] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const onResize = useCallback((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  function goToPreviousPage() {
    setCurrentPage((prevPageNumber) => prevPageNumber - 2);
  }

  function goToNextPage() {
    setCurrentPage((prevPageNumber) => prevPageNumber + 2);
  }

  return (
    <div className="header">
      <header>
        <h1>AI Magazine</h1>
        <button onClick={goToPreviousPage}>Previous</button>
        <button onClick={goToNextPage}>Next</button>
      </header>
      <div className="container">
        <div className="container__document" ref={setContainerRef}>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div className="page-container" key={`page_${index + 1}`}>
                <Page
                  pageNumber={index + 1}
                  width={
                    containerWidth
                      ? Math.min(containerWidth, maxWidth)
                      : maxWidth
                  }
                />
              </div>
            )).slice(currentPage, currentPage + 2)}
          </Document>
        </div>
      </div>
    </div>
  );
}