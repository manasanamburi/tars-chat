import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const createConversation = mutation({
  args: {
    user1: v.id("users"),
    user2: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("conversations").collect();

    const found = existing.find(
      (c) =>
        !c.isGroup &&
        c.participants.includes(args.user1) &&
        c.participants.includes(args.user2)
    );

    if (found) return found._id;

    return await ctx.db.insert("conversations", {
      isGroup: false,
      participants: [args.user1, args.user2],
    });
  },
});


export const getConversations = query({
  handler: async (ctx) => {
    return await ctx.db.query("conversations").collect();
  },
});


export const getConversation = query({
  args: {
    id: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },

  
});