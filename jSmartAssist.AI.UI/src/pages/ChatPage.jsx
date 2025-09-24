import { useState } from 'react'
import { sendMessage } from '../services/apiService'

export default function ChatPage() {
  const [sessionId] = useState(1)
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState([])

  const handleSend = async () => {
    const res = await sendMessage({ sessionId, message })
    setHistory([...history, { sender: 'You', message }, { sender: 'AI', message: res.data.response }])
    setMessage('')
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="border p-4 h-80 overflow-y-scroll mb-4">
        {history.map((msg, i) => (
          <div key={i}><strong>{msg.sender}:</strong> {msg.message}</div>
        ))}
      </div>
      <div className="flex">
        <input value={message} onChange={e => setMessage(e.target.value)} className="border flex-grow p-2" />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4">Send</button>
      </div>
    </div>
  )
}