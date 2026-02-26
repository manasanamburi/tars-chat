"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();

  const users = useQuery(api.users.getUsers);
  const conversation = useQuery(api.conversations.getConversation, {
    id: params.id as Id<"conversations">,
  });

  const messages = useQuery(api.messages.getMessages, {
    conversationId: params.id as Id<"conversations">,
  });

  const sendMessage = useMutation(api.messages.sendMessage);
  const [text, setText] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages || !users || !user || !conversation)
    return <p className="p-6">Loading chat...</p>;

  const me = users.find((u) => u.clerkId === user.id);
  if (!me) return <p className="p-6">Loading...</p>;

  const otherId = conversation.participants.find((p) => p !== me._id);
  const otherUser = users.find((u) => u._id === otherId);

  const handleSend = async () => {
    if (!text.trim()) return;

    await sendMessage({
      conversationId: params.id as Id<"conversations">,
      senderId: me._id,
      text,
    });

    setText("");
  };

 
  function formatMessageTime(timestamp: number) {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const sameYear = date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (sameYear) {
      return (
        date.toLocaleDateString([], {
          month: "short",
          day: "numeric",
        }) +
        ", " +
        date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }

    return (
      date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }

  return (
    <main className="flex flex-col h-full p-4">
      {}
      <div className="flex items-center gap-2 mb-4">
        <button
          className="md:hidden px-3 py-1 border rounded"
          onClick={() => router.push("/")}
        >
          ←
        </button>

        <h1 className="text-xl font-bold">
          {otherUser?.name || "User"}
        </h1>
      </div>

      {}
      <div className="border p-4 flex-1 overflow-y-auto mb-4 rounded bg-white">
        {messages.length === 0 && <p>No messages yet</p>}

        {messages.map((m) => (
          <div
            key={m._id}
            className={`mb-2 ${
              m.senderId === me._id ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`px-3 py-2 rounded inline-block max-w-xs ${
                m.senderId === me._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {m.text}

              <div className="text-xs opacity-70">
                {formatMessageTime(m._creationTime)}
              </div>
            </span>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {}
      <div className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          className="bg-blue-500 text-white px-4 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </main>
  );
}