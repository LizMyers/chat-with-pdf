'use client';

import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { RocketIcon, CircleArrowDown, SaveIcon, HammerIcon } from 'lucide-react';
import useUpload, { StatusText } from '../hooks/useUpload';
import { useRouter } from 'next/navigation';

function FileUploader() {
  const { fileId, handleUpload, progress, status } = useUpload();
  const router = useRouter();

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      handleUpload(file);
    } else {
      // Handle the case where no file is selected
    }
  }, [handleUpload]);

  const statusIcons: { [key in StatusText]: JSX.Element } = {
    [StatusText.UPLOADING]: <HammerIcon className="h-16 w-16 animate-spin" />,
    [StatusText.UPLOADED]: <CircleArrowDown className="h-16 w-16 animate-bounce" />,
    [StatusText.SAVING]: <SaveIcon className="h-16 w-16 animate-spin" />,
    [StatusText.GENERATING]: <RocketIcon className="h-16 w-16 animate-spin" />,
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
      {uploadInProgress && (
        <div className="mt-32 flex flex-col justify-center items-center gap-5">
          <div 
            className={`radial-progress bg-indigo-300 text-white border-indigo-600 border-4 ${progress === 100 ? "hidden" : ""}`}
            role="progressbar"
            style={{
              "--value": progress,
              "--size": "12rem",
              "--thickness": "1.3rem"
            } as React.CSSProperties} // Extend CSSProperties to accept custom properties
          >
            {progress} %
          </div>
          {/* Render Status Icon */}
          {status && statusIcons[status as StatusText]}

          <p className="text-indigo-600 animate-pulse">
          {status ? String(status) : ''}
          </p>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`
          p-10 border-2
          ${isFocused || isDragAccept ? 'border-solid' : 'border-dashed'}
          border-indigo-700 
          text-indigo-700 
          ${isFocused || isDragAccept ? 'text-white' : 'border-indigo-700'}
          rounded-lg 
          mx-4 md:mx-10 my-10 
          h-96 
          w-full 
          max-w-[95%]
          md:max-w-[92%]
          flex flex-col items-center
          justify-center ${isDragActive ? 'bg-gray-100' : 'bg-gray-200'}
          ${isFocused || isDragAccept ? 'bg-indigo-400' : 'bg-indigo-100'}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center">
          {isDragActive ? (
            <>
              <RocketIcon className="h-16 w-16 animate-ping" />
              <p>Drop the files here ...</p>
            </>
          ) : (
            <>
              <CircleArrowDown className="h-16 w-16 animate-bounce" />
              <p>Drag &#39;n&#39; drop some files here, or click to select files</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileUploader;