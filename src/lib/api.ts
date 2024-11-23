import axios from "axios";

interface FileMetadata {
  name: string;
  size: number;
  type: string;
  passwordProtected: boolean;
}

const BASE_LOCAL_API = "http://localhost:8000";
const BASE_PROD_API = process.env.API_BASE;

const BASE_LOCAL_STORAGE = "http://localhost:8001";
const BASE_PROD_STORAGE = process.env.STORAGE_BASE;

export async function convertToPdf(
  files: File[],
  metadata: FileMetadata[],
  password: string = "",
) {
  try {
    let BASE;
    if (process.env.NODE_ENV === "development") {
      BASE = BASE_LOCAL_API;
    } else {
      BASE = BASE_PROD_API;
    }
    if (files.length === 1) {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("password", password);
      console.log(formData.entries());
      const res = await axios.post(`${BASE}/convert`, formData, {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res;
    } else if (files.length > 1) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      // create a string of 0 and 1 based on index and weather password is set or not
      let pp = "";
      for (let i = 0; i < metadata.length; i++) {
        if (metadata[i].passwordProtected === true) {
          pp += "1";
        } else {
          pp += "0";
        }
      }
      formData.append("passwordProtect", pp);
      formData.append("password", password);

      const res = await axios.post(`${BASE}/convert-bulk`, formData, {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res;
    } else {
      console.log("No files to convert");
    }
  } catch (e) {
    console.log("Internal Server Error", e);
  }
}

export const downloadZIP = async (urls: any) => {
  try {
    let BASE;
    if (process.env.NODE_ENV === "development") {
      BASE = BASE_LOCAL_STORAGE;
    } else {
      BASE = BASE_PROD_STORAGE;
    }
    const f = [];
    for (let i = 0; i < urls.length; i++) {
      f.push(urls[i].name);
    }
    const data = JSON.stringify({
      files: f,
    });
    const res = await axios.post(`${BASE}/download-bulk`, data, {
      responseType: "blob",
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const blobUrl = URL.createObjectURL(res.data);
    const link = document.createElement("a");
    link.href = blobUrl;
    const filename = "downloaded_files.zip";
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (e) {
    console.log("Internal Server Error", e);
  }
};
