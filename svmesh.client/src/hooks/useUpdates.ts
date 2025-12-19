import { useState, useEffect } from "react";
import type { UpdatePost } from "../utils/markdown";
import { parseMarkdownPost, sortPostsByDate } from "../utils/markdown";

// Fetch markdown files from the server
const fetchUpdateFiles = async () => {
  const fileNames = [
    "welcome-to-svmesh.md",
    "community-meeting.md",
    "test-event.md",
  ];

  const updateModules: Record<string, string> = {};

  for (const fileName of fileNames) {
    try {
      const response = await fetch(`/content/updates/${fileName}`);
      if (response.ok) {
        updateModules[`/updates/${fileName}`] = await response.text();
      }
    } catch (error) {
      console.warn(`Failed to fetch ${fileName}:`, error);
    }
  }

  return updateModules;
};

export function useUpdates() {
  const [posts, setPosts] = useState<UpdatePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const updateModules = await fetchUpdateFiles();
        const parsedPosts: UpdatePost[] = [];

        for (const [path, content] of Object.entries(updateModules)) {
          // Extract filename without extension as slug
          const slug = path.split("/").pop()?.replace(".md", "") || "";
          const post = parseMarkdownPost(content, slug);
          parsedPosts.push(post);
        }

        // Sort posts by date (newest first)
        const sortedPosts = sortPostsByDate(parsedPosts);
        setPosts(sortedPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load updates");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return { posts, loading, error };
}
