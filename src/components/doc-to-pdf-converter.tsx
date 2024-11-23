"use client";

import { useState } from "react";
import { Folder, File, Lock, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import ConversionResult from "@/components/result";

import { convertToPdf } from "@/lib/api";

interface FileMetadata {
  name: string;
  size: number;
  type: string;
  passwordProtected: boolean;
}

interface ConvertedFile {
  name: string;
  downloadUrl: string;
}

export default function DocToPdfConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState<FileMetadata[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [password, setPassword] = useState("");
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [isConverted, setIsConverted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileList = Array.from(event.target.files);
      setFiles(fileList);
      setMetadata(
        fileList.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          passwordProtected: false,
        })),
      );
      setAllSelected(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setMetadata((prevMetadata) => prevMetadata.filter((_, i) => i !== index));
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handlePasswordProtect = (index: number) => {
    setMetadata((prevMetadata) => {
      const newMetadata = prevMetadata.map((item, i) =>
        i === index
          ? { ...item, passwordProtected: !item.passwordProtected }
          : item,
      );
      setAllSelected(newMetadata.every((item) => item.passwordProtected));
      return newMetadata;
    });
  };

  const handleSelectAll = () => {
    setAllSelected(!allSelected);
    setMetadata((prevMetadata) =>
      prevMetadata.map((item) => ({
        ...item,
        passwordProtected: !allSelected,
      })),
    );
  };

  const handleConvert = async () => {
    try {
      if (
        metadata.some((file) => {
          file.passwordProtected;
        }) &&
        password == ""
      ) {
        alert("Please enter password to protect the file");
        return;
      }
      setLoading(true);
      const result = await convertToPdf(files, metadata, password);
      if (result === undefined) {
        return;
      }
      let res: ConvertedFile[] = [];
      let base = process.env.BASE_PROD_STORAGE;
      if (base == "" || base == undefined) {
        base = "http://localhost:8001";
      }
      if (result.data.path) {
        res.push({
          name: result.data.path,
          downloadUrl: `${base}/download/${result.data.path}`,
        });
      } else {
        for (let i = 0; i < result.data.files.length; i++) {
          res.push({
            name: result.data.files[i],
            downloadUrl: `${base}/download/${result.data.files[i]}`,
          });
        }
      }
      setLoading(false);
      setConvertedFiles(res);
      setIsConverted(true);
    } catch (error) {
      setLoading(false);
      console.error("Conversion failed:", error);
    }
  };

  const handleGenerateLink = async () => {
    if (convertedUrl) {
      try {
        // const link = await generateShareableLink(convertedUrl)
        // setShareableLink(link)
      } catch (error) {
        console.error("Failed to generate shareable link:", error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  return (
    <div className="container flex flex-col w-full justify-center align-middle mx-auto p-4 space-y-6">
      {isConverted ? (
        <ConversionResult files={convertedFiles}></ConversionResult>
      ) : (
        <>
          <div className="text-center w-full">
            <div className="m-4">
              <Input
                type="file"
                onChange={handleFileChange}
                accept=".doc,.docx"
                className="hidden"
                id="single-file-upload"
                multiple
              />
              <Button variant="default">
                <Label
                  htmlFor="single-file-upload"
                  className="cursor-pointer flex flex-row align-middle justify-center"
                >
                  <File className="mr-2 h-4 w-4" /> Select Files
                </Label>
              </Button>
            </div>
          </div>

          {metadata.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">File Metadata</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>
                      <div className="flex items-center justify-between">
                        Password Protect
                        <Switch
                          id="select-all"
                          checked={allSelected}
                          onCheckedChange={handleSelectAll}
                        />
                      </div>
                    </TableHead>
                    <TableHead>Remove</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metadata.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell>{file.name}</TableCell>
                      <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                      <TableCell>{file.type}</TableCell>
                      <TableCell>
                        <Switch
                          id={`password-protect-${index}`}
                          checked={file.passwordProtected}
                          onCheckedChange={() => handlePasswordProtect(index)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          id={`remove-file-${index}`}
                          onClick={() => handleRemoveFile(index)}
                        >
                          <Trash2 className="text-gray-500" size="22" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {metadata.some((file) => file.passwordProtected) && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <div className="flex flex-row justify-center align-middle mt-5">
                  <Button variant="outline" className="w-[50%]">
                    <Lock className="mr-2 h-4 w-4" /> Set Password
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Set Password</DialogTitle>
                  <DialogDescription>
                    Enter a password to protect your selected PDF files.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      className="col-span-3"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() => {
                      setIsDialogOpen(false);
                    }}
                  >
                    Save Password
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {files.length > 0 && (
            <div className="flex flex-row justify-center align-middle mt-10">
              <Button
                onClick={handleConvert}
                disabled={files.length === 0 || loading}
                className="w-[50%]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                ) : (
                  "Convert to PDF"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
