"use client";

import { useState } from "react";
import { Check, MessageSquare, Reply, Send, Trash2 } from "lucide-react";
import type { MessageRow } from "@/lib/admin/types";
import { site } from "@/lib/site";

type ReplyStatus = "idle" | "sending" | "sent" | "error";

interface Props {
  messages: MessageRow[];
  onDeleteMessage: (id: number) => void | Promise<void>;
  onReplyToMessage: (id: number, reply: string) => Promise<void>;
}

export default function MessagesSection({
  messages,
  onDeleteMessage,
  onReplyToMessage,
}: Props) {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<ReplyStatus>("idle");

  const resetReplyState = () => {
    setReplyingTo(null);
    setReplyText("");
    setReplyStatus("idle");
  };

  const handleReply = async (id: number) => {
    if (!replyText.trim()) return;

    setReplyStatus("sending");

    try {
      await onReplyToMessage(id, replyText);
      setReplyStatus("sent");
      setReplyText("");
      setTimeout(() => resetReplyState(), 1500);
    } catch {
      setReplyStatus("error");
    }
  };

  return (
    <div className="mt-8 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-gray-400" />
          <div>
            <h2 className="text-base font-semibold text-gray-900">Messages</h2>
            <p className="text-xs text-gray-400">
              {messages.length} message{messages.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="px-6 py-8 text-center text-sm text-gray-400">No messages yet</div>
      ) : (
        <div className="divide-y divide-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className="px-6 py-4 transition-colors hover:bg-gray-50/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{message.name}</p>
                    <a
                      href={`mailto:${message.email}`}
                      className="truncate text-sm text-violet-600 hover:underline"
                    >
                      {message.email}
                    </a>
                    {message.replied_at && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                        <Check className="h-3 w-3" />
                        Replied
                      </span>
                    )}
                  </div>
                  <p className="mt-1 max-h-32 overflow-y-auto text-sm whitespace-pre-wrap text-gray-600">
                    {message.message}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(message.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    {message.replied_at && (
                      <>
                        {" "}
                        &middot; Replied{" "}
                        {new Date(message.replied_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </>
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(replyingTo === message.id ? null : message.id);
                      setReplyText("");
                      setReplyStatus("idle");
                    }}
                    className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-violet-50 hover:text-violet-500"
                    title="Reply"
                  >
                    <Reply className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteMessage(message.id)}
                    className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {replyingTo === message.id && (
                <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50/50 p-4">
                  <p className="mb-2 text-xs font-medium text-violet-600">
                    Replying to {message.name} &lt;{message.email}&gt;
                  </p>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    rows={3}
                    className="w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                    disabled={replyStatus === "sending" || replyStatus === "sent"}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-gray-400">From: {site.contactEmail}</p>
                    <div className="flex items-center gap-2">
                      {replyStatus === "error" && (
                        <p className="text-xs text-red-500">Failed to send. Try again.</p>
                      )}
                      {replyStatus === "sent" && (
                        <p className="flex items-center gap-1 text-xs text-emerald-600">
                          <Check className="h-3 w-3" /> Sent!
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={resetReplyState}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100"
                        disabled={replyStatus === "sending"}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReply(message.id)}
                        disabled={
                          !replyText.trim() ||
                          replyStatus === "sending" ||
                          replyStatus === "sent"
                        }
                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        <Send className="h-3 w-3" />
                        {replyStatus === "sending" ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
