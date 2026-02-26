"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import ConversationItem from "./ConversationItem";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = useQuery(api.conversations.getConversations);
  const users = useQuery(api.users.getUsers);
  const { user } = useUser();

  if (!conversations || !users || !user)
    return <p className="p-6">Loading sidebar...</p>;

  const me = users.find((u) => u.clerkId === user.id);
  if (!me) return <p className="p-6">Loading...</p>;

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {}
      <div className="w-64 border-r p-4 bg-black-100 overflow-y-auto">
        <h2 className="font-bold mb-4">Chats</h2>

       {conversations.map((c) => (
  <ConversationItem
    key={c._id}
    conversation={c}
    me={me}
    users={users}
  />
))}
      </div>

      {}
      <div className="flex-1 bg-black">{children}</div>
    </div>
  );
}