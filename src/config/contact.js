import { Mail, Phone } from "lucide-react";
import { FaFacebookF, FaFacebookMessenger, FaWhatsapp } from "react-icons/fa6";

export const contactConfig = {
  // Keep contact destinations here so Contact and Footer stay in sync.
  messengerUrl: "https://m.me/SABAmodest1815",
  facebookUrl: "https://www.facebook.com/SABAmodest1815",
  whatsappNumber: "+880 1788-477280",
  phoneNumber: "+880 1788-477280",
  emailAddress: "tohamd245@gmail.com",
};

function isPlaceholder(value) {
  return /REPLACE_WITH|example\.com|X{3,}/i.test(value);
}

function safeExternalUrl(value, hosts) {
  try {
    const url = new URL(value);
    if (
      isPlaceholder(value)
      || url.protocol !== "https:"
      || url.username
      || url.password
      || !hosts.includes(url.hostname.toLowerCase())
      || url.pathname === "/"
    ) {
      return "";
    }
    return url.toString();
  } catch {
    return "";
  }
}

export function getContactOptions(config = contactConfig) {
  const phoneNumber = String(config.phoneNumber || "").trim();
  const phoneDigits = phoneNumber.replace(/[\s().-]/g, "");
  const validPhone = !isPlaceholder(phoneNumber) && /^\+?\d{7,15}$/.test(phoneDigits);
  const emailAddress = String(config.emailAddress || "").trim();
  const validEmail = !isPlaceholder(emailAddress) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
  const whatsappNumber = String(config.whatsappNumber || "").trim();
  const whatsappDigits = whatsappNumber.replace(/\D/g, "");
  const validWhatsapp = !isPlaceholder(whatsappNumber)
    && /^\+?[\d\s().-]+$/.test(whatsappNumber)
    && /^[1-9]\d{7,14}$/.test(whatsappDigits);
  const facebookUrl = safeExternalUrl(config.facebookUrl, ["facebook.com", "www.facebook.com"]);
  const messengerUrl = safeExternalUrl(config.messengerUrl, ["m.me", "messenger.com", "www.messenger.com"]);

  return [
    {
      label: "Phone",
      detail: validPhone ? phoneNumber : "Add SABA MODEST's phone number",
      href: validPhone ? `tel:${phoneDigits}` : "",
      icon: Phone,
      external: false,
    },
    {
      label: "Email",
      detail: validEmail ? emailAddress : "Add SABA MODEST's email address",
      href: validEmail ? `mailto:${emailAddress}` : "",
      icon: Mail,
      external: false,
    },
    {
      label: "WhatsApp",
      detail: validWhatsapp ? whatsappNumber : "Add SABA MODEST's WhatsApp number",
      href: validWhatsapp ? `https://wa.me/${whatsappDigits}` : "",
      icon: FaWhatsapp,
      external: true,
    },
    {
      label: "Facebook",
      detail: facebookUrl ? "Visit our Facebook page" : "Add SABA MODEST's Facebook page URL",
      href: facebookUrl,
      icon: FaFacebookF,
      external: true,
    },
    {
      label: "Messenger",
      detail: messengerUrl ? "Message us on Messenger" : "Add SABA MODEST's Messenger URL",
      href: messengerUrl,
      icon: FaFacebookMessenger,
      external: true,
    },
  ];
}
