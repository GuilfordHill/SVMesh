import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import { Box, CircularProgress } from "@mui/material";
import MarkdownContent from "../components/MarkdownContent";
import { PageSection, SimpleHero } from "../components/ui";
import { parsePageMarkdown, type ParsedPage } from "../utils/pageMarkdown";

import susquehannaValley from "../assets/susquehanna-valley.jpg";
import meshtasticPowered from "../assets/meshtastic-powered.png";
import tBeam from "../assets/tbeam.jpg";

const assetMap: Record<string, string> = {
  "susquehanna-valley.jpg": susquehannaValley,
  "meshtastic-powered.png": meshtasticPowered,
  "tbeam.jpg": tBeam,
};

const defaultHero = susquehannaValley;

export default function MarkdownPage() {
  const { slug } = useParams<{ slug: string }>();
  const [pageData, setPageData] = useState<ParsedPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageExists, setPageExists] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPage = async () => {
      if (!slug) {
        setPageExists(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setPageData(null);

      try {
        const listResponse = await fetch("/api/content/pages");
        if (!listResponse.ok) {
          throw new Error(`Failed to load page index (${listResponse.status})`);
        }

        const { files }: { files: string[] } = await listResponse.json();
        const normalizedSlug = slug.toLowerCase();
        const hasPage = files.some(
          (fileName) =>
            fileName.replace(/\.md$/, "").toLowerCase() === normalizedSlug
        );

        if (!hasPage) {
          setPageExists(false);
          return;
        }

        setPageExists(true);
        const data = await parsePageMarkdown(normalizedSlug);
        if (!cancelled) {
          setPageData(data);
        }
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load page content";
        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPage();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (slug === "home") {
    return <Navigate to="/" replace />;
  }

  if (slug === "maps") {
    return <Navigate to="/maps" replace />;
  }

  if (loading) {
    return (
      <PageSection>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <CircularProgress size={40} />
        </Box>
      </PageSection>
    );
  }

  if (pageExists === false) {
    throw new Error(`Page not found: /${slug}`);
  }

  if (error) {
    throw new Error(error);
  }

  if (!pageData) {
    throw new Error("Failed to load page content.");
  }

  const { metadata, content } = pageData;
  const heroImage = (metadata.heroImage && assetMap[metadata.heroImage]) || defaultHero;
  const title = metadata.title || formatTitle(slug || "");

  return (
    <>
      <SimpleHero
        backgroundImage={heroImage}
        title={title}
        subtitle={metadata.subtitle || ""}
        backgroundPosition="center 70%"
        attributionUrl={metadata.attributionUrl}
      />
      <PageSection>
        <MarkdownContent content={content} />
      </PageSection>
    </>
  );
}

function formatTitle(slug: string) {
  if (!slug) return "Page";
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
