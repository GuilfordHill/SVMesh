import { useEffect, useState } from "react";

export interface MenuItem {
  name: string;
  href: string;
}

const STATIC_PAGES = ["Home", "Maps"];
const STATIC_MENU_ITEMS: MenuItem[] = [
  { name: "Home", href: "/" },
  { name: "Maps", href: "/maps" },
];

/**
 * Hook to load menu items dynamically from markdown files
 * and combine them with static pages like Home and Maps
 */
export function useMenuItems(): MenuItem[] {
  const [dynamicItems, setDynamicItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("/api/content/pages");
        if (!response.ok) {
          console.warn("Failed to fetch page list for menu");
          return;
        }

        const { files }: { files: string[] } = await response.json();

        const items = files
          .map((fileName) => fileName.replace(/\.md$/, ""))
          .filter((slug) => !STATIC_PAGES.some((sp) => sp.toLowerCase() === slug.toLowerCase()))
          .map((slug) => ({
            name: formatMenuName(slug),
            href: `/${slug}`,
          }))
          .sort((a, b) => {
            // Sort by name alphabetically
            return a.name.localeCompare(b.name);
          });

        setDynamicItems(items);
      } catch (error) {
        console.error("Error loading menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  return [...STATIC_MENU_ITEMS, ...dynamicItems];
}

function formatMenuName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
