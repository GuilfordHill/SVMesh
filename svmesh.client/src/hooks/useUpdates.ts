import { useState, useEffect } from "react";
import type { UpdatePost } from "../utils/markdown";
import { parseMarkdownPost, sortPostsByDate } from "../utils/markdown";

// Fetch markdown files dynamically from the server with cache busting
const fetchUpdateFiles = async (cacheBust: string) => {
  const updateModules: Record<string, string> = {};

  try {
    // First, get the list of available files from the API
    const listResponse = await fetch(`/api/content/updates?v=${cacheBust}`, {
      cache: "no-store",
    });
    if (!listResponse.ok) {
      throw new Error(`Failed to get file list: ${listResponse.status}`);
    }

    const { files } = await listResponse.json();

    // Then fetch each file's content
    for (const fileName of files) {
      try {
        const response = await fetch(
          `/content/updates/${fileName}?v=${cacheBust}`,
          { cache: "no-store" }
        );
        if (response.ok) {
          updateModules[`/updates/${fileName}`] = await response.text();
        } else {
          console.warn(`Failed to fetch ${fileName}: ${response.status}`);
        }
      } catch (error) {
        console.warn(`Failed to fetch ${fileName}:`, error);
      }
    }
  } catch (error) {
    console.error("Failed to load update files:", error);
  }

  return updateModules;
};

export function useUpdates() {
  const [posts, setPosts] = useState<UpdatePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Poll periodically so updates appear without a redeploy or manual refresh
  const pollIntervalMs = 30_000;

  useEffect(() => {
    let cancelled = false;
    let pollTimer: number | undefined;

    const loadPosts = async () => {
      try {
        const cacheBust = Date.now().toString();
        const updateModules = await fetchUpdateFiles(cacheBust);
        const parsedPosts: UpdatePost[] = [];

        for (const [path, content] of Object.entries(updateModules)) {
          // Extract filename without extension as slug
          const slug = path.split("/").pop()?.replace(".md", "") || "";
          const post = parseMarkdownPost(content, slug);
          parsedPosts.push(post);
        }

        // Sort posts by date (newest first)
        const sortedPosts = sortPostsByDate(parsedPosts);
        if (!cancelled) {
          setPosts(sortedPosts);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load updates"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPosts();

    // Poll for changes so new/updated markdown is reflected automatically
    pollTimer = window.setInterval(loadPosts, pollIntervalMs);

    // Refresh when the tab regains focus
    const onVisibilityChange = () => {
      if (!document.hidden) {
        void loadPosts();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      if (pollTimer) {
        window.clearInterval(pollTimer);
      }
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return { posts, loading, error };
}
