/**
 * Social platform registry.
 *
 * Every supported platform is defined here with its brand icon and color.
 * The admin only stores a URL per platform_key; icons and colors are
 * always sourced from this file — never user input.
 */
import {
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaTelegram,
  FaYoutube,
  FaLinkedin,
  FaWhatsapp,
  FaSnapchat,
  FaPinterest,
  FaXTwitter,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

export type SocialPlatform = {
  key: string;
  label: string;
  icon: IconType;
  color: string; // brand hex color for hover accent
  placeholder: string; // URL example shown in admin input
};

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    key: "instagram",
    label: "Instagram",
    icon: FaInstagram,
    color: "#E1306C",
    placeholder: "https://instagram.com/yourhandle",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: FaFacebook,
    color: "#1877F2",
    placeholder: "https://facebook.com/yourpage",
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: FaTiktok,
    color: "#010101",
    placeholder: "https://tiktok.com/@yourhandle",
  },
  {
    key: "telegram",
    label: "Telegram",
    icon: FaTelegram,
    color: "#0088CC",
    placeholder: "https://t.me/yourchannel",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: FaYoutube,
    color: "#FF0000",
    placeholder: "https://youtube.com/@yourchannel",
  },
  {
    key: "x",
    label: "X (Twitter)",
    icon: FaXTwitter,
    color: "#000000",
    placeholder: "https://x.com/yourhandle",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: FaLinkedin,
    color: "#0A66C2",
    placeholder: "https://linkedin.com/in/yourprofile",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: FaWhatsapp,
    color: "#25D366",
    placeholder: "https://wa.me/251923791278",
  },
  {
    key: "snapchat",
    label: "Snapchat",
    icon: FaSnapchat,
    color: "#FFFC00",
    placeholder: "https://snapchat.com/add/yourhandle",
  },
  {
    key: "pinterest",
    label: "Pinterest",
    icon: FaPinterest,
    color: "#E60023",
    placeholder: "https://pinterest.com/yourhandle",
  },
];
