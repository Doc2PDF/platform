import DocToPdfConverter from "@/components/doc-to-pdf-converter";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex-grow relative">
      <div className="flex flex-col">
        <div className="text-6xl text-center mt-10 font-bold">
          Convert WORD to PDF
        </div>
        <div className="text-1xl text-center mt-2 text-gray-500">
          Make DOC and DOCX files easy to read by converting them to PDF.
        </div>
      </div>
      <DocToPdfConverter />
      <Footer />
    </div>
  );
}
