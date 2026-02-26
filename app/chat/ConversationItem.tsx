"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function ConversationItem({ conversation, me, users }: any) {
  const router = useRouter();

  if (!conversation || !me || !users) return null;

 
  const otherId = conversation.participants.find((p: any) => p !== me._id);
  const otherUser = users.find((u: any) => u._id === otherId);

  
  const lastMessage = useQuery(api.messages.getLastMessage, {
    conversationId: conversation._id,
  });

  return (
    <div
      onClick={() => router.push(`/chat/${conversation._id}`)}
      className="p-2 border-b hover:bg-gray-200 cursor-pointer rounded"
    >
      {}
      <div className="font-medium">{otherUser?.name || "User"}</div>

      {}
      <div className="text-sm text-gray-500 truncate">
        {lastMessage ? lastMessage.text : "No messages yet"}
      </div>
    </div>
  );
}