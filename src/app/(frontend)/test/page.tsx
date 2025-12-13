"use client";

import { useChat } from "@ai-sdk/react";

export default function Page() {
  const { messages} = useChat({
    api: '/chat',
  });

  return (
    <div className="flex flex-col h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Chat con AI</h1>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`p-3 rounded-lg max-w-xs ${
            message.role === 'user'
              ? 'bg-blue-500 text-white self-end'
              : 'bg-gray-200 text-black'
          }`}>
            {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Escribe tu mensaje..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}