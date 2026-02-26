"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const users = useQuery(api.users.getUsers);
  const createConversation = useMutation(api.conversations.createConversation);
  const { user } = useUser();
  const router = useRouter();

  const [search, setSearch] = useState("");

  if (!users || !user) return <p>Loading...</p>;

  const me = users.find((u) => u.clerkId === user.id);
  if (!me) return <p>Loading...</p>;

  
  const filteredUsers = users.filter(
    (u) =>
      u._id !== me._id &&
      u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Start Chat</h1>

      {}
      <input
        className="border p-2 w-full mb-4 rounded"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredUsers.length === 0 && (
        <p className="text-gray-500">No users found</p>
      )}

      {filteredUsers.map((u) => (
        <div
          key={u._id}
          className="p-3 border-b cursor-pointer hover:bg-gray-100 rounded"
          onClick={async () => {
  const conversationId = await createConversation({
    user1: me._id,
    user2: u._id,
  });

  router.push(`/chat/${conversationId}`);
}}
        >
          {u.name}
        </div>
      ))}
    </main>
  );
}