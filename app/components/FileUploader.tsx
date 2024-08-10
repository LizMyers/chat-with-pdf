'use client';

import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  CheckCircleIcon,
  CircleArrowDown,
  HammerIcon,
  RocketIcon,
  SaveIcon,
} from "lucide-react";
import useUpload, { StatusText } from "../hooks/useUpload";
import { useRouter } from "next/navigation";
import useSubscription from "../hooks/useSubscription";
import { useToast } from "@/components/ui/use-toast";

function FileUploader() {
  const { progress, status, fileId, handleUpload } = useUpload();
  const { isOverFileLimit, filesLoading } = useSubscription();
  const router = useRouter();
  const { toast } = useToast();
  //set max file size to 100k
  const maxFileSize = 102400; // 100KB in bytes
  const maxFileSizeInKB = Math.round(maxFileSize / 1024); // Convert to KB and round

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  function formatUserFileSize(userFile: File) {
    const userFileSizeInBytes = userFile.size;
    let userFileSizeDisplay;

    if (userFileSizeInBytes >= 1024 * 1024) {
      // Convert to MB if file size is equal to or greater than 1 MB
      const userFileSizeInMB = userFileSizeInBytes / (1024 * 1024);
      userFileSizeDisplay = `${userFileSizeInMB.toFixed(2)} MB`;
    } else {
      // Otherwise, convert to KB
      const userFileSizeInKB = userFileSizeInBytes / 1024;
      userFileSizeDisplay = `${userFileSizeInKB.toFixed(2)} KB`;
    }

    return `File is too big: (${userFileSizeDisplay})`;
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 1) {
        toast({
          variant: "destructive",
          title: "Too Many Files",
          description: "Please upload only one PDF file at a time.",
        });
        return;
      }
  
      const file = acceptedFiles[0];
  
      if (file) {
        if (file.type !== "application/pdf") {
          toast({
            variant: "destructive",
            title: "Invalid File Type",
            description: `Only PDF files are allowed.`,
          });
        } else if (file.size > maxFileSize) {
          toast({
            variant: "destructive",
            title: `${formatUserFileSize(file)}`,
            description: `Please use a PDF smaller than ${maxFileSizeInKB}KB`,
          });
        } else if (!isOverFileLimit && !filesLoading) {
          console.log("Uploading file: ", file.name);
          await handleUpload(file);
        } else {
          toast({
            variant: "destructive",
            title: "Free Plan File Limit Reached",
            description:
              "You have reached the maximum number of files allowed for your account. Please upgrade to add more documents.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Sorry! Only PDF files are allowed.",
        });
      }
    },
    [handleUpload, isOverFileLimit, filesLoading, toast, maxFileSizeInKB]
  );

  const statusIcons: {
    [key in StatusText]: JSX.Element;
  } = {
    [StatusText.UPLOADING]: (
      <RocketIcon className="h-20 w-20 text-indigo-600" />
    ),
    [StatusText.UPLOADED]: (
      <CheckCircleIcon className="h-20 w-20 text-indigo-600" />
    ),
    [StatusText.SAVING]: <SaveIcon className="h-20 w-20 text-indigo-600" />,
    [StatusText.GENERATING]: (
      <HammerIcon className="h-20 w-20 text-indigo-600 animate-bounce" />
    ),
  };

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: {
        "application/pdf": [".pdf"],
      },
    });

  const uploadInProgress = progress != null && progress >= 0 && progress <= 100;

  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
      {/* Loading... tomorrow! */}
      {uploadInProgress && (
        <div className="mt-32 flex flex-col justify-center items-center gap-5">
          <div
            className={`radial-progress bg-indigo-300 text-white border-indigo-600 border-4 ${
              progress === 100 && "hidden"
            }`}
            role="progressbar"
            style={{
              // @ts-ignore
              "--value": progress,
              "--size": "12rem",
              "--thickness": "1.3rem",
            }}
          >
            {progress} %
          </div>

          {/* Render Status Icon */}
          {
            // @ts-ignore
            statusIcons[status!]
          }

          {/* @ts-ignore */}
          <p className="text-indigo-600 animate-pulse">{status}</p>
        </div>
      )}

      {!uploadInProgress && (
        <div
          {...getRootProps()}
          className={`p-10 border-2 border-dashed mt-10 w-[90%]  border-indigo-600 text-indigo-600 rounded-lg h-96 flex items-center justify-center ${
            isFocused || isDragAccept ? "bg-indigo-300" : "bg-indigo-100"
          }`}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center justify-center">
            {isDragActive ? (
              <>
                <RocketIcon className="h-20 w-20 animate-ping" />
                <p>Drop the files here ...</p>
              </>
            ) : (
              <>
                <CircleArrowDown className="h-20 w-20 animate-bounce" />
                <p>Drag n drop PDF files here, or click to select files</p>
                <p>File size is limited to 100KB (that&apos;s about 2 pages) </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default FileUploader;
