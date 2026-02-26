"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function ConversationItem({ conversation, me, users }: any) {
  const otherId = conversation.participants.find((p: any) => p !== me._id);
  const otherUser = users.find((u: any) => u._id === otherId);

  const lastMessage = useQuery(api.messages.getLastMessage, {
    conversationId: conversation._id,
  });

  return (
    <Link href={`/chat/${conversation._id}`}>
      <div className="p-2 border-b hover:bg-gray-200 cursor-pointer rounded">
        <div className="font-medium">{otherUser?.name || "User"}</div>

        <div className="text-sm text-gray-500 truncate">
          {lastMessage?.text || "No messages yet"}
        </div>
      </div>
    </Link>
  );
}