'use client'

import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
    CheckCircleIcon, 
    CircleArrowDown,
    HammerIcon,
    Rocket,
    RocketIcon,
    SaveIcon,
} from 'lucide-react'

function FileUploader() {
    const onDrop = useCallback((acceptedFiles: File[]) => {
            // Log each file's name
        acceptedFiles.forEach(file => {
        console.log(`File name: ${file.name}`);
      });
      }, []);

      const {getRootProps, getInputProps, isDragActive, isDragAccept, isFocused} = useDropzone({onDrop})
    
      return (
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

          <div className = "flex flex-col justify-center items-center">
           { isDragActive ? (
                <>
                    <RocketIcon className="h-16 w-16 animate-ping" />
                    <p>Drop the files here ...</p>
                </>
            ) : (
                
                <>
                    <CircleArrowDown className="h-16 w-16 animate-bounce" />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                </>
            )}
              
          </div>
        </div>
      )
}

export default FileUploader