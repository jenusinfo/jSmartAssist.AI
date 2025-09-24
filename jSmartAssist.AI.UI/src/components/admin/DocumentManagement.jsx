import { useState } from 'react'
import { uploadDocument } from '../../services/apiService'

export default function DocumentManagement() {
  const [file, setFile] = useState(null)

  const handleUpload = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    await uploadDocument(formData)
    alert('Document uploaded')
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Manage Documents</h3>
      <input type="file" onChange={e => setFile(e.target.files[0])} className="mb-2" />
      <button onClick={handleUpload} className="bg-green-500 text-white px-4 py-2 rounded">Upload</button>
    </div>
  )
}