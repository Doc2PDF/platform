"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadZIP } from "@/lib/api";

interface ConvertedFile {
  name: string;
  downloadUrl: string;
}

export default function ConversionResult(files: any) {
  console.log(files.files.length);
  const handleDownloadAll = async () => {
    await downloadZIP(files.files);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center flex-col align-middle justify-center space-x-2">
        <CheckCircle className="h-8 w-8 text-green-500" />
        <h1 className="text-2xl font-bold">Congratulations!</h1>
        <p className="text-md mt-4">
          Your files have been successfully converted to PDF.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead className="text-right">Download</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.files.length > 0 &&
            (files.files as ConvertedFile[]).map((file, index) => (
              <TableRow key={index}>
                <TableCell>{file.name}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <a href={file.downloadUrl} download target="_blank">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {files.files.length > 1 && (
        <div className="flex flex-row align-middle justify-end">
          <Button onClick={handleDownloadAll}>
            <Download className="h-4 w-4 mr-2" />
            Download as ZIP
          </Button>
        </div>
      )}
    </div>
  );
}
