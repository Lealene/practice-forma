export interface NavLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface Stat {
  value: string;
  label: string;
}

export const staticNavLinks: NavLink[] = [
  { label: "Journal", href: "/#journal" },
];

export const announcements: string[] = [
  "Free carbon-neutral delivery on orders over $150",
  "Made to order in 4 to 6 weeks",
];

export const features: string[] = [
  "Solid FSC oak, never veneer",
  "10-year structural warranty",
  "Free returns within 60 days",
  "Made to order, not mass produced",
];

export const stats: Stat[] = [
  { value: "38", label: "Makers on the floor" },
  { value: "100%", label: "Renewable timber" },
  { value: "14k", label: "Homes furnished" },
];

export const editorialImage: string =
  "https://tse4.mm.bing.net/th/id/OIP.q3Uwh4YBitRE5XDwBithMAHaD2?r=0&rs=1&pid=ImgDetMain&o=7&rm=3";

export const footerColumns: FooterColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "Bedroom", href: "/products?category=bedroom" },
      { label: "Library", href: "/products?category=library" },
      { label: "Dining Room", href: "/products?category=dining-room" },
      { label: "Office", href: "/products?category=office" },
    ],
  },
{
    title: "Studio",
    links: [
      { label: "Our story", href: "/#our-story" },
      { label: "Materials", href: "/#materials" },
      { label: "Journal", href: "/#journal" },
      { label: "Trade program", href: "/trade-program" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Care guide", href: "/care-guide" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
