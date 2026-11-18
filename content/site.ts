/**
 * Company details used across the site.
 * Everything marked TODO is a placeholder until Jaya Nexus confirms it.
 */
export const site = {
  name: "Jaya Nexus",
  legalName: "Jaya Nexus Sdn Bhd",
  url: "https://jayanexus.com",
  whatsapp: "60XXXXXXXXX", // TODO: real WhatsApp number, digits only, with country code (e.g. 60123456789)
  phone: "+60 X-XXXX XXXX", // TODO: real phone number
  email: "contact@jayanexus.com", // TODO: confirm this mailbox exists
  address: "Seri Kembangan, Selangor", // TODO: full street address and postcode
  addressLocality: "Seri Kembangan",
  addressRegion: "Selangor",
  postalCode: "", // TODO
  founded: 2015, // TODO: confirm founding year
  registrations: ["SSM: TODO", "CIDB: TODO"], // TODO: SSM number and CIDB grade
  hours: {
    en: "Monday to Saturday, 8.30 am to 6 pm",
    ms: "Isnin hingga Sabtu, 8.30 pagi hingga 6 petang",
  }, // TODO: confirm hours
  areaServed: ["Klang Valley", "Selangor", "Kuala Lumpur", "Negeri Sembilan", "Malaysia"],
  // TODO: replace with the exact business location once the address is confirmed
  mapEmbed:
    "https://www.google.com/maps?q=Seri+Kembangan,+Selangor&output=embed",
  stats: {
    years: new Date().getFullYear() - 2015, // TODO: follows `founded`
    squareMetres: 120000, // TODO: real total m² laid
    projects: 300, // TODO: real number of projects handed over
  },
} as const;

/** Build a wa.me link with a prefilled message. */
export function whatsappLink(text?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
