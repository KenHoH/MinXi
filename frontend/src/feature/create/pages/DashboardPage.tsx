"use client";

import { useEffect, useState } from "react";
import { ContentCreation } from "../components/ContentCreation";
import { PostCreation } from "../components/PostCreation";
import { BoardCreation } from "../components/BoardCreation";
import RootLayout from "@/app/LayoutPage";
import useContentService from "@/shared/hooks/useContentService";
import { useToast } from "@/shared/context/ToastContext";
import type Content from "@/feature/content/object/PublicContent";
import type Metadata from "@/feature/content/object/Metadata";
import { useAuthContext } from "@/feature/auth/context/AuthContext";

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
  const [contentItems, setContentItems] = useState<Content[]>([]);
  const [postItems, setPostItems] = useState<Content[]>([]);
  const [boardItems, setBoardItems] = useState(dummyUserBoards);
  const { getByUser, getFiles } = useContentService();
  const { showToast } = useToast();
  const { user } = useAuthContext();

  const getContentByUser = async (userId: number) => {
    try {
      const res = await getByUser(userId);
      console.log("Fetched content by user:", res);

      const contentItems: Content[] = [];
      const content = res.filter(
        (item) => item.post_type === "image" || item.post_type === "video"
      );

      for (const item of content) {
        const files = await getFiles(item.content_id, item.area_id);

        console.log("Fetched files for content:", files);
        const metadata: Metadata[] = files.map((file) => ({
          file_id: file.file_id,
          content_id: file.content_id,
          content_area_id: file.content_area_id,
          thumbnail_url: file.thumbnail || "",
          file_url: file.filepath,
          type: file.type || "",
        }));

        console.log(metadata);
        const contentItem: Content = {
          content_id: item.content_id,
          creator_id: item.creator_id,
          parent_id: null,
          thumbnail_url: metadata[0]?.thumbnail_url || "",
          title: item.title,
          description: item.description,
          post_type: item.post_type as "image" | "video",
          likes: item.likes || 0,
          comments: item.comments || 0,
          views: item.views || 0,
          pins: item.pins || 0,
          reports: item.reports || 0,
          visibilityPrivate: item.visibilityPrivate || false,
          area_id: item.area_id,
          metadata,
        };

        contentItems.push(contentItem);
      }

      setContentItems(contentItems);
    } catch (error) {
      showToast("Failed to fetch user content.");
      console.error("Error fetching content:", error);
    }
  };

  const getPostByUser = async (userId: number) => {
    try {
      const res = await getByUser(userId);

      const postItems: Content[] = [];
      const posts = res.filter((item) => item.post_type === "post");

      for (const item of posts) {
        let metadata: Metadata[] = [];
        try {
          const files = await getFiles(item.content_id, item.area_id);
          metadata = files.map((file) => ({
            file_id: file.file_id,
            content_id: file.content_id,
            content_area_id: file.content_area_id,
            thumbnail_url: file.thumbnail || "",
            file_url: file.filepath,
            type: file.type || "",
          }));
        } catch (err) {
          console.error("Error fetching files for post:", err);
        }

        const postItem: Content = {
          content_id: item.content_id,
          creator_id: item.creator_id,
          parent_id: item.parent_id ?? null,
          thumbnail_url: "",
          title: item.title,
          description: item.description,
          post_type: "post" as const,
          likes: item.likes || 0,
          comments: item.comments || 0,
          views: item.views || 0,
          pins: item.pins || 0,
          reports: item.reports || 0,
          visibilityPrivate: item.visibilityPrivate || false,
          area_id: item.area_id,
          metadata,
        };

        postItems.push(postItem);
      }

      setPostItems(postItems);
    } catch (error) {
      showToast("Failed to fetch user posts.");
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (!user || !user.user_id) {
      showToast("User not logged in.");
      return;
    }
    getContentByUser(user.user_id);
    getPostByUser(user.user_id);
  }, [user]);

  const handleDeleteContent = (id: number) => {
    setContentItems(
      contentItems.filter((item: Content) => item.content_id !== id)
    );
  };

  const handleDeletePost = (id: number) => {
    setPostItems(postItems.filter((item: Content) => item.content_id !== id));
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

            {activeTab === "content" && (
              <ContentCreation
                items={contentItems}
                onDelete={handleDeleteContent}
              />
            )}

            {activeTab === "post" && (
              <PostCreation
                items={postItems as any}
                onDelete={handleDeletePost}
              />
            )}

            {activeTab === "board" && (
              <BoardCreation items={boardItems} onDelete={handleDeleteBoard} />
            )}
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
