import { Card, Box, Stack } from "@mui/material";
import { SimpleHero, PageSection, StyledText } from "../components/ui";
import FacebookIcon from "@mui/icons-material/Facebook";
import susquehannaValley from "../assets/susquehanna-valley.jpg";
import discordLogo from "../assets/discord.png";
import { SOCIAL_LINKS } from "../config/social";

function DiscordIcon() {
  return (
    <Box
      component="img"
      src={discordLogo}
      alt="Discord"
      sx={{ width: 80, height: 80, objectFit: "contain" }}
    />
  );
}

function SocialLogoCard({
  title,
  href,
  icon,
}: {
  title: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Card
      component="a"
      href={href}
      target="_blank"
      rel="noreferrer"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 2,
        boxShadow: 3,
        p: 3,
        minWidth: 200,
        textAlign: "center",
        transition: "transform 0.3s ease, boxShadow 0.3s ease",
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        {icon}
      </Box>

      <StyledText
        type="heading"
        component="h3"
        sx={{
          m: 0,
        }}
      >
        {title}
      </StyledText>
    </Card>
  );
}

export default function Socials() {
  return (
    <>
      <SimpleHero
        backgroundImage={susquehannaValley}
        title="Join the community"
        subtitle="Find us on Discord and Facebook"
        backgroundPosition="center 70%"
        attributionUrl="https://commons.wikimedia.org/wiki/File:Ridges_and_valleys_near_the_West_Branch_Susquehanna_River.jpg"
      />
      <PageSection>
        <Stack spacing={4}>
          <StyledText type="heading" component="h2">
            Join the Community
          </StyledText>
          <StyledText type="body-large">
            The SVMesh community is thriving on two main platforms, each serving different
            communication styles and preferences. Our Discord server is active with real-time
            discussion, and our Facebook is active with images and event notifications. Come join
            the community! We are always happy to help newcomers get started! Join us on your
            platform of choice:
          </StyledText>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <SocialLogoCard
              title="Discord Server"
              href={SOCIAL_LINKS.discord}
              icon={<DiscordIcon />}
            />
            <SocialLogoCard
              title="Facebook Group"
              href={SOCIAL_LINKS.facebook}
              icon={<FacebookIcon sx={{ fontSize: 80 }} />}
            />
          </Box>

          <Stack spacing={1.5}>
            <StyledText type="heading" component="h3">
              Community Guidelines
            </StyledText>
            <Box component="ul" sx={{ pl: 3, m: 0 }}>
              <StyledText component="li" type="body-large">
                Be nice: Treat everyone with kindness and respect. No personal attacks, harassment,
                or discriminatory language based on race, gender, religion, or other identities.
                Foul language is acceptable, but content promoting hate, violence, or bullying is
                strictly prohibited.
              </StyledText>
              <StyledText component="li" type="body-large">
                No spam: Avoid excessive self-promotion, advertisements, or irrelevant links unless
                approved by admins.
              </StyledText>
              <StyledText component="li" type="body-large">
                Keep civil: Disagreements are fine, but keep discussions constructive. No
                name-calling or aggressive behavior.
              </StyledText>
              <StyledText component="li" type="body-large">
                Don't share personal information: Protect privacy, do not share personal details of
                yourself or others without consent.
              </StyledText>
              <StyledText component="li" type="body-large">
                Report issues: Use the report feature or message admins directly for rule violations
                or concerns.
              </StyledText>
              <StyledText component="li" type="body-large">
                No unauthorized sales or fundraising: Sales or fundraising posts require prior admin
                approval.
              </StyledText>
              <StyledText component="li" type="body-large">
                Respect the law: Only share content you have the right to post, following copyright
                and intellectual property laws.
              </StyledText>
            </Box>
          </Stack>
        </Stack>
      </PageSection>
    </>
  );
}
