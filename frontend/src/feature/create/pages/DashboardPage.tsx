"use client";

import { useState } from "react";
import { ContentCreation } from "../components/ContentCreation";
import { PostCreation } from "../components/PostCreation";
import { BoardCreation } from "../components/BoardCreation";
import RootLayout from "@/app/LayoutPage";

// Dummy data
const dummyUserContent = [
  {
    content_id: 1,
    creator_id: 5,
    parent_id: null,
    title: "My First Photo",
    description: "A beautiful first photo from my collection",
    post_type: "image" as const,
    likes: 120,
    comments: 15,
    views: 1200,
    pins: 5,
    reports: 0,
    visibilityPrivate: false,
    metadata: [
      {
        file_id: 1,
        content_id: 1,
        content_area_id: 1,
        thumbnail_url:
          "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
        file_url:
          "http://localhost:3000/uploads/content/1763296139023-929553449.jpg",
      },
    ],
  },
  {
    content_id: 2,
    creator_id: 6,
    parent_id: null,
    title: "Travel Vlog",
    description: "Amazing travel vlog from my recent trip",
    post_type: "video" as const,
    likes: 340,
    comments: 45,
    views: 5600,
    pins: 12,
    reports: 0,
    visibilityPrivate: false,
    metadata: [
      {
        file_id: 2,
        content_id: 2,
        content_area_id: 1,
        thumbnail_url:
          "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
        file_url: "http://localhost:3000/uploads/content/travel-vlog.mp4",
      },
    ],
  },
  {
    content_id: 3,
    creator_id: 7,
    parent_id: null,
    title: "Sunset Shots",
    description: "Beautiful sunset photography series",
    post_type: "image" as const,
    likes: 200,
    comments: 28,
    views: 2100,
    pins: 8,
    reports: 0,
    visibilityPrivate: false,
    metadata: [
      {
        file_id: 3,
        content_id: 3,
        content_area_id: 1,
        thumbnail_url:
          "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
        file_url: "http://localhost:3000/uploads/content/sunset.jpg",
      },
    ],
  },
  {
    content_id: 4,
    creator_id: 8,
    parent_id: null,
    title: "City Walk",
    description: "Urban exploration video",
    post_type: "video" as const,
    likes: 150,
    comments: 22,
    views: 1800,
    pins: 3,
    reports: 0,
    visibilityPrivate: false,
    metadata: [
      {
        file_id: 4,
        content_id: 4,
        content_area_id: 1,
        thumbnail_url:
          "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
        file_url: "http://localhost:3000/uploads/content/city-walk.mp4",
      },
    ],
  },
];

const dummyUserPosts = [
  {
    content_id: 1,
    creator_id: 5,
    parent_id: null,
    title: "My Journey",
    description:
      "Starting my creative journey today. Excited to share my thoughts and ideas...",
    likes: 250,
    comments: 35,
    post_type: "post" as const,
    views: 1500,
    pins: 2,
    reports: 0,
    visibilityPrivate: false,
    metadata: [],
  },
  {
    content_id: 2,
    creator_id: 6,
    parent_id: null,
    title: "Design Tips",
    description:
      "Here are some design tips I've learned over the years that might help you...",
    likes: 420,
    comments: 52,
    post_type: "post" as const,
    views: 2800,
    pins: 6,
    reports: 0,
    visibilityPrivate: false,
    metadata: [],
  },
  {
    content_id: 3,
    creator_id: 7,
    parent_id: null,
    title: "Photography Basics",
    description:
      "Understanding lighting is crucial for better photography. Let me explain...",
    likes: 310,
    comments: 41,
    post_type: "post" as const,
    views: 2100,
    pins: 4,
    reports: 0,
    visibilityPrivate: false,
    metadata: [],
  },
];

const dummyUserBoards = [
  {
    board_id: 1,
    board_thumbnail: "http://localhost:3000/uploads/thumbnail/board1.jpg",
    creator_id: 5,
    title: "Travel",
    description: "All my travel photography and videos from around the world",
    visibilityPrivate: false,
    created_at: new Date().toISOString(),
    contents: [
      {
        content_id: 1,
        creator_id: 5,
        parent_id: null,
        title: "My First Photo",
        description: "A beautiful first photo from my collection",
        post_type: "image" as const,
        likes: 120,
        comments: 15,
        views: 1200,
        pins: 5,
        reports: 0,
        visibilityPrivate: false,
        metadata: [
          {
            file_id: 1,
            content_id: 1,
            content_area_id: 1,
            thumbnail_url:
              "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
            file_url:
              "http://localhost:3000/uploads/content/1763296139023-929553449.jpg",
          },
        ],
      },
      {
        content_id: 2,
        creator_id: 6,
        parent_id: null,
        title: "Travel Vlog",
        description: "Amazing travel vlog from my recent trip",
        post_type: "video" as const,
        likes: 340,
        comments: 45,
        views: 5600,
        pins: 12,
        reports: 0,
        visibilityPrivate: false,
        metadata: [
          {
            file_id: 2,
            content_id: 2,
            content_area_id: 1,
            thumbnail_url:
              "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
            file_url: "http://localhost:3000/uploads/content/travel-vlog.mp4",
          },
        ],
      },
    ],
  },
  {
    board_id: 2,
    board_thumbnail: "http://localhost:3000/uploads/thumbnail/board2.jpg",
    creator_id: 5,
    title: "Photography",
    description: "Collection of my best photography work",
    visibilityPrivate: false,
    created_at: new Date().toISOString(),
    contents: [
      {
        content_id: 3,
        creator_id: 7,
        parent_id: null,
        title: "Sunset Shots",
        description: "Beautiful sunset photography series",
        post_type: "image" as const,
        likes: 200,
        comments: 28,
        views: 2100,
        pins: 8,
        reports: 0,
        visibilityPrivate: false,
        metadata: [
          {
            file_id: 3,
            content_id: 3,
            content_area_id: 1,
            thumbnail_url:
              "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
            file_url: "http://localhost:3000/uploads/content/sunset.jpg",
          },
        ],
      },
    ],
  },
  {
    board_id: 3,
    board_thumbnail: "http://localhost:3000/uploads/thumbnail/board3.jpg",
    creator_id: 5,
    title: "Design Inspiration",
    description: "Design ideas and inspiration from my projects",
    visibilityPrivate: true,
    created_at: new Date().toISOString(),
    contents: [
      {
        content_id: 1,
        creator_id: 5,
        parent_id: null,
        title: "My Journey",
        description: "Starting my creative journey today...",
        likes: 250,
        comments: 35,
        post_type: "post" as const,
        views: 1500,
        pins: 2,
        reports: 0,
        visibilityPrivate: false,
        metadata: [],
      },
    ],
  },
];

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState<"content" | "post" | "board">(
    "content"
  );
  const [contentItems, setContentItems] = useState(dummyUserContent);
  const [postItems, setPostItems] = useState(dummyUserPosts);
  const [boardItems, setBoardItems] = useState(dummyUserBoards);

  const handleDeleteContent = (id: number) => {
    setContentItems(contentItems.filter((item) => item.content_id !== id));
  };

  const handleDeletePost = (id: number) => {
    setPostItems(postItems.filter((item) => item.content_id !== id));
  };

  const handleDeleteBoard = (id: number) => {
    setBoardItems(boardItems.filter((item) => item.board_id !== id));
  };

  return (
    <RootLayout>
      <div className="w-full h-full bg-dark-900">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-100 mb-8">Create</h1>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-dark-700 mb-8">
              {(["content", "post", "board"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                    activeTab === tab
                      ? "border-burgundy-600 text-burgundy-400"
                      : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Content Creation */}
            {activeTab === "content" && (
              <ContentCreation
                items={contentItems}
                onDelete={handleDeleteContent}
              />
            )}

            {/* Post Creation */}
            {activeTab === "post" && (
              <PostCreation items={postItems} onDelete={handleDeletePost} />
            )}

            {/* Board Creation */}
            {activeTab === "board" && (
              <BoardCreation items={boardItems} onDelete={handleDeleteBoard} />
            )}
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
