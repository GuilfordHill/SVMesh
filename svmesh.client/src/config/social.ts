/**
 * Social links configuration
 * Uses environment variables with fallback defaults
 */

export const SOCIAL_LINKS = {
  discord: import.meta.env.VITE_DISCORD_URL || "https://discord.gg/svmesh",
  facebook: import.meta.env.VITE_FACEBOOK_URL || "https://www.facebook.com/groups/svmesh",
};
