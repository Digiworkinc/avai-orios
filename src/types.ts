export type View = 'landing' | 'admin';

export interface Solution {
  id: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  type: 'Indoor' | 'Outdoor';
  pixelPitch: string;
  brightness: string;
  status: 'Available' | 'Low Stock' | 'Out of Stock';
  imageUrl?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  desc: string;
  features: string[];
  images: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
}

export interface WebsiteContent {
  hero: {
    tagline: string;
    headline: string;
    subHeadline: string;
    imageUrl: string;
    stats: {
      value: string;
      label: string;
    };
  };
  solutions: Solution[];
  products: Product[];
  portfolio: PortfolioItem[];
  contact: {
    title: string;
    subTitle: string;
    team: TeamMember[];
  };
  footer: {
    companyName: string;
    copyright: string;
  };
}
