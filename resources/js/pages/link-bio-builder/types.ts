export interface BioLinkData {
  config: {
    theme: string;
    preset: number;
    background: {
      type: 'color' | 'gradient' | 'image';
      color: string;
      gradient: string;
      image: string;
    };
    buttonColor: string;
    buttonTextColor: string;
    textColor: string;
    font: string;
    header: {
      name: string;
      tagline: string;
      profile_image: string;
    };
    links?: Array<{
      text: string;
      url: string;
      description: string;
      icon: string;
    }>;
    social?: {
      items: Array<{
        platform: string;
        url: string;
        icon: string;
      }>;
      display: boolean;
    };
  };
}