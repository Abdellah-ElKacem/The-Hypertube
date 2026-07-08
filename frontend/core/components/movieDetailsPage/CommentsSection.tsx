"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ThumbsDown, MessageCircleMore, Send } from "lucide-react";
import { CommentItem } from "@/core/types/library";
import { User } from "@/core/lib/users";

interface CommentsSectionProps {
    comments: CommentItem[];
    commentsLoading: boolean;
    onAddComment: (content: string, parentId?: string) => Promise<void>;
    onEditComment: (content: string, commentId: string) => Promise<void>;
    onDeleteComment: (commentId: string) => Promise<void>;
    onLikeComment: (commentId: string) => Promise<void>;
    onDislikeComment: (commentId: string) => Promise<void>;
    user: User | null;
}

const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
};

export default function CommentsSection({
    comments,
    commentsLoading,
    onAddComment,
    onEditComment,
    onDeleteComment,
    onLikeComment,
    onDislikeComment,
    user,
}: CommentsSectionProps) {
    const [newCommentText, setNewCommentText] = useState<string>("");
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState<string>("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState<string>("");
    const [rootError, setRootError] = useState<string | null>(null);
    const [replyError, setReplyError] = useState<string | null>(null);
    const [editError, setEditError] = useState<string | null>(null);
    const allowedCharactersRegex = /^[a-zA-Z0-9\s.,!?''"\-_+@]+$/;
    const isRootTextInvalid = newCommentText !== "" && !allowedCharactersRegex.test(newCommentText);
    const isReplyTextInvalid = replyText !== "" && !allowedCharactersRegex.test(replyText);
    const isEditTextInvalid = editText !== "" && !allowedCharactersRegex.test(editText);
    
    const handleRootSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentText.trim() || isRootTextInvalid) return;
        setRootError(null);
        try {
            await onAddComment(newCommentText.trim());
            setNewCommentText("");
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Failed to add comment.";
            setRootError(msg);
        }
    };

    const handleReplySubmit = async (e: React.FormEvent, parentId: string) => {
        e.preventDefault();
        if (!replyText.trim() || isReplyTextInvalid) return;
        setReplyError(null);
        try {
            await onAddComment(replyText.trim(), parentId);
            setReplyingToId(null);
            setReplyText("");
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Failed to add reply.";
            setReplyError(msg);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent, commentId: string) => {
        e.preventDefault();
        if (!editText.trim() || isEditTextInvalid) return;
        setEditError(null);
        try {
            await onEditComment(editText.trim(), commentId);
            setEditingId(null);
            setEditText("");
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Failed to update comment.";
            setEditError(msg);
        }
    };

    const countTotalComments = (commentList: CommentItem[]): number => {
        let count = commentList.length;
        commentList.forEach((c) => {
            if (c.replies && Array.isArray(c.replies)) {
                count += c.replies.length;
            }
        });
        return count;
    };

    const totalComments = countTotalComments(comments);

    const renderCommentItem = (item: CommentItem, rootParentId?: string) => {
        const userDetails = item.userId;
        const isEditing = editingId === item._id;
        const isReplying = replyingToId === item._id;
        const isAuthor = !!(user?._id && userDetails?._id && user._id === userDetails._id);
        const parentIdForReply = rootParentId || item._id;

        const isLiked = !!(user?._id && item.likes?.includes(user._id));
        const isDisliked = !!(user?._id && item.dislikes?.includes(user._id));
        const likesCount = item.likes ? item.likes.length : 0;
        const dislikesCount = item.dislikes ? item.dislikes.length : 0;

        return (
            <div className="flex gap-4 items-start group/comment py-3 w-full">
                {userDetails ? (
                    <Link
                        href={`/profile/${userDetails._id}`}
                        className="cursor-pointer relative w-9 h-9 rounded-full overflow-hidden border border-white/10 shrink-0"
                    >
                        {userDetails.avatar ? (
                            <Image
                                src={userDetails.avatar}
                                alt={
                                    userDetails.firstName
                                        ? `${userDetails.firstName} ${userDetails.lastName || ""}`
                                        : "User avatar"
                                }
                                fill
                                className="object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                                sizes="36px"
                                unoptimized
                            />
                        ) : (
                            <div className="w-full h-full bg-linear-to-tr from-[#2A2836] to-[#3F3D52] text-white flex items-center justify-center font-bold text-xs uppercase select-none">
                                {userDetails.firstName
                                    ? userDetails.firstName.charAt(0).toUpperCase()
                                    : "?"}
                            </div>
                        )}
                    </Link>
                ) : (
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10 shrink-0 bg-linear-to-tr from-[#2A2836] to-[#3F3D52] text-white flex items-center justify-center font-bold text-xs uppercase select-none">
                        ?
                    </div>
                )}

                <div className="grow flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        {userDetails ? (
                            <Link
                                href={`/profile/${userDetails._id}`}
                                className="cursor-pointer text-xs font-bold text-white"
                            >
                                {userDetails.firstName
                                    ? `${userDetails.firstName} ${userDetails.lastName || ""}`.trim()
                                    : userDetails.username}
                            </Link>
                        ) : (
                            <span className="text-xs font-bold text-gray-500 cursor-default">
                                Deleted User
                            </span>
                        )}
                        <span className="text-[10px] text-gray-500">•</span>
                        <span className="text-[10px] text-gray-500">
                            {formatRelativeTime(item.createdAt)}
                        </span>
                        {isAuthor && (
                            <span className="text-[9px] bg-white/5 border border-white/10 text-gray-400 px-1.5 py-0.5 rounded-md font-semibold select-none">
                                Author
                            </span>
                        )}
                    </div>

                    {isEditing ? (
                        <form
                            onSubmit={(e) => handleEditSubmit(e, item._id)}
                            className="flex flex-col gap-2 mt-1"
                        >
                            <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                maxLength={499}
                                className={`w-full bg-white/5 border ${
                                    isEditTextInvalid
                                        ? "border-red-500/50 focus:border-red-500"
                                        : "border-white/10 focus:border-[#EC4949]/50"
                                } rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none resize-none`}
                                rows={2}
                            />
                            {isEditTextInvalid && (
                                <p className="text-red-400 text-[10px] -mt-1">
                                    Only letters, numbers, spaces, and basic punctuation (.,!?'-_@) are allowed.
                                </p>
                            )}
                            {editError && (
                                <p className="text-red-400 text-[10px] -mt-1">
                                    {editError}
                                </p>
                            )}
                            <div className="flex justify-between items-center mt-1">
                                <span className={`text-[10px] ${editText.length >= 480 ? "text-[#EC4949]" : "text-gray-500"}`}>
                                    {editText.length}/500
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingId(null);
                                            setEditText("");
                                            setEditError(null);
                                        }}
                                        className="px-3 py-1 text-[10px] text-gray-400 hover:text-white transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!editText.trim() || isEditTextInvalid}
                                        className="px-4 py-1 bg-[#EC4949] hover:bg-[#ff5a5a] disabled:opacity-50 text-white rounded-full text-[10px] font-semibold transition-colors cursor-pointer"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <p className="text-xs md:text-sm text-white/80 leading-relaxed break-words font-light mt-0.5">
                            {item.content}
                        </p>
                    )}

                    {!isEditing && (
                        <div className="flex items-center gap-4 mt-2">
                            <button
                                onClick={() => onLikeComment(item._id)}
                                className={`flex items-center gap-1.5 text-[10px] md:text-xs transition-colors cursor-pointer ${
                                    isLiked
                                        ? "text-[#F8E9A1]"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                <span>{likesCount}</span>
                                <Heart
                                    size={12}
                                    fill={isLiked ? "#F8E9A1" : "none"}
                                />
                                <span>Like</span>
                            </button>

                            <button
                                onClick={() => onDislikeComment(item._id)}
                                className={`flex items-center gap-1 text-[10px] md:text-xs transition-colors cursor-pointer ${
                                    isDisliked
                                        ? "text-[#EC4949]"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                <span>{dislikesCount}</span>
                                <ThumbsDown
                                    size={12}
                                    className={isDisliked ? "fill-[#EC4949]" : ""}
                                />
                                <span>Dislike</span>
                            </button>

                            {!rootParentId && (
                                <button
                                    onClick={() => {
                                        setReplyingToId(isReplying ? null : item._id);
                                        setReplyText("");
                                        setReplyError(null);
                                    }}
                                    className={`flex items-center gap-1 text-[10px] md:text-xs transition-colors cursor-pointer ${
                                        isReplying
                                            ? "text-[#EC4949]"
                                            : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                    <MessageCircleMore size={12} />
                                    <span>Reply</span>
                                </button>
                            )}

                            {isAuthor && (
                                <div className="flex items-center gap-3 ml-auto opacity-0 group-hover/comment:opacity-100 transition-opacity duration-200">
                                    <button
                                        onClick={() => {
                                            setEditingId(item._id);
                                            setEditText(item.content);
                                            setEditError(null);
                                        }}
                                        className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-[#EC4949] transition-colors cursor-pointer"
                                        title="Edit comment"
                                    >
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => onDeleteComment(item._id)}
                                        className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                        title="Delete comment"
                                    >
                                        <span>Delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {isReplying && (
                        <form
                            onSubmit={(e) => handleReplySubmit(e, parentIdForReply)}
                            className="flex gap-3 items-start mt-3 bg-white/5 border border-white/5 p-3 rounded-xl w-full"
                        >
                            <div className="grow flex flex-col gap-2">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    maxLength={499}
                                    placeholder={`Reply to ${item.userId?.firstName || item.userId?.username || "user"}...`}
                                    rows={2}
                                    className={`w-full bg-white/5 border ${
                                        isReplyTextInvalid
                                            ? "border-red-500/50 focus:border-red-500"
                                            : "border-white/10 focus:border-[#EC4949]/50"
                                    } rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none resize-none`}
                                />
                                {isReplyTextInvalid && (
                                    <p className="text-red-400 text-[10px] -mt-1">
                                        Only letters, numbers, spaces, and basic punctuation (.,!?'-_@) are allowed.
                                    </p>
                                )}
                                {replyError && (
                                    <p className="text-red-400 text-[10px] -mt-1">
                                        {replyError}
                                    </p>
                                )}
                                <div className="flex justify-between items-center mt-1">
                                    <span className={`text-[10px] ${replyText.length >= 480 ? "text-[#EC4949]" : "text-gray-500"}`}>
                                        {replyText.length}/500
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setReplyingToId(null);
                                                setReplyText("");
                                            }}
                                            className="px-3 py-1.5 text-[10px] text-gray-400 hover:text-white transition-colors cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!replyText.trim() || isReplyTextInvalid}
                                            className="px-4 py-1.5 bg-[#EC4949] hover:bg-[#ff5a5a] disabled:opacity-50 text-white rounded-full text-[10px] font-semibold transition-colors cursor-pointer"
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="grow flex flex-col gap-1 w-full lg:max-w-[calc(100%-340px)]">
            <div className="flex gap-4 items-center text-sm mb-6">
                <p className="text-[#9C9C9C]">
                    {commentsLoading
                        ? "Loading comments..."
                        : `${totalComments} Comment${totalComments !== 1 ? "s" : ""}`}
                </p>
                <div className="flex gap-2 items-center text-white/80">
                    <MessageCircleMore size={15} color="white" />
                    <p className="font-medium">Drop Yours</p>
                </div>
            </div>

            {/* Root Comment Form */}
            <form
                onSubmit={handleRootSubmit}
                className="flex gap-4 items-start bg-white/5 border border-white/5 p-4 rounded-2xl mb-2"
            >
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                    {user?.avatar ? (
                        <Image
                            src={user.avatar}
                            alt="Your avatar"
                            fill
                            className="object-cover"
                            sizes="40px"
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full bg-linear-to-tr from-[#EC4949] to-[#FF7878] text-white flex items-center justify-center font-bold text-sm uppercase select-none">
                            {user?.firstName
                                ? user.firstName.charAt(0).toUpperCase()
                                : "U"}
                        </div>
                    )}
                </div>
                <div className="grow flex flex-col gap-3">
                    <textarea
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        maxLength={499}
                        placeholder="Share your thoughts about this movie..."
                        rows={2}
                        className={`w-full bg-white/5 border ${
                            isRootTextInvalid
                                ? "border-red-500/50 focus:border-red-500"
                                : "border-white/10 focus:border-[#EC4949]/50"
                        } rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none resize-none transition-colors duration-200`}
                    />
                    {isRootTextInvalid && (
                        <p className="text-red-400 text-xs -mt-1">
                            Only letters, numbers, spaces, and basic punctuation (.,!?'-_@) are allowed.
                        </p>
                    )}
                    {rootError && (
                        <p className="text-red-400 text-xs -mt-1">
                            {rootError}
                        </p>
                    )}
                    <div className="flex justify-between items-center mt-1">
                        <span className={`text-[10px] ${newCommentText.length >= 480 ? "text-[#EC4949]" : "text-gray-500"}`}>
                            {newCommentText.length}/500
                        </span>
                        <div className="flex gap-2">
                            {newCommentText.trim() && (
                                <button
                                    type="button"
                                    onClick={() => setNewCommentText("")}
                                    className="px-4 py-1.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={!newCommentText.trim() || isRootTextInvalid}
                                className="flex items-center gap-2 px-5 py-2 bg-[#EC4949] hover:bg-[#ff5a5a] disabled:opacity-50 disabled:hover:bg-[#EC4949] text-white rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                            >
                                <span>Post Comment</span>
                                <Send size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            {commentsLoading ? (
                <div className="flex flex-col gap-6 animate-pulse mt-4">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5"
                        >
                            <div className="w-10 h-10 bg-white/5 rounded-full flex-shrink-0" />
                            <div className="flex flex-col gap-2 grow">
                                <div className="h-4 bg-white/5 rounded w-1/4" />
                                <div className="h-3 bg-white/5 rounded w-full" />
                                <div className="h-3 bg-white/5 rounded w-5/6" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length > 0 ? (
                <div className="flex flex-col gap-4 mt-4 divide-y divide-white/5">
                    {comments.map((comment) => (
                        <div
                            key={comment._id}
                            className="flex flex-col pt-4 first:pt-0"
                        >
                            {/* Main Comment */}
                            {renderCommentItem(comment)}

                            {/* Replies Container */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="border-l border-white/5 pl-4 ml-6 mt-1 flex flex-col gap-2">
                                    {comment.replies.map((reply: CommentItem) => (
                                        <div key={reply._id} className="flex flex-col">
                                            {renderCommentItem(reply, comment._id)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-10 text-center text-xs text-gray-500 font-light">
                    No comments yet. Be the first to share your thoughts!
                </div>
            )}
        </div>
    );
}
