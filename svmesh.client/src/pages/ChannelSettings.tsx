import { useEffect, useState } from "react";
import MarkdownContent from "../components/MarkdownContent";
import { SimpleHero, PageSection, StyledText } from "../components/ui";
import { parsePageMarkdown, type ParsedPage } from "../utils/pageMarkdown";

// Import assets
import tBeam from "../assets/tbeam.jpg";

const assetMap: Record<string, string> = {
  "tbeam.jpg": tBeam,
};

export default function ChannelSettings() {
  const [pageData, setPageData] = useState<ParsedPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPageContent = async () => {
      try {
        const data = await parsePageMarkdown("channel-settings");
        setPageData(data);
      } catch (error) {
        console.error("Failed to load channel settings content:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPageContent();
  }, []);

  if (loading) {
    return (
      <PageSection>
        <StyledText type="body">Loading...</StyledText>
      </PageSection>
    );
  }

  if (!pageData) {
    return (
      <PageSection>
        <StyledText type="body">Failed to load page content.</StyledText>
      </PageSection>
    );
  }

  const { metadata, content } = pageData;

  return (
    <>
      <SimpleHero
        backgroundImage={
          metadata.heroImage ? assetMap[metadata.heroImage] : tBeam
        }
        title={metadata.title || "Channel Settings"}
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
