import React from "react"

const FileUpload = ({ files, onChange, accept, multiple }) => {
  const handleFileChange = e => {
    const newFiles = Array.from(e.target.files).filter(file => 
      accept.split(',').some(ext => file.name.toLowerCase().endsWith(ext.trim().toLowerCase()))
    )
    onChange(newFiles)
  }

  const removeFile = index => {
    onChange(prevFiles => prevFiles.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="block mb-2">
        <input
          type="file"
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          className="hidden"
        />
        <div className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
          ატვირთეთ ფაილები
        </div>
      </label>

      {files.length > 0 && (
        <div className="mt-4">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded mb-2">
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload 