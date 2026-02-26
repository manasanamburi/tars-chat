import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    image: v.string(),
  }).index("by_clerkId", ["clerkId"]),

  conversations: defineTable({
  isGroup: v.boolean(),
  name: v.optional(v.string()),
  participants: v.array(v.id("users")),
  typing: v.optional(v.id("users")), 
}),

  messages: defineTable({
  conversationId: v.id("conversations"),
  senderId: v.id("users"),
  text: v.string(),
  seen: v.optional(v.boolean()),
}),
});