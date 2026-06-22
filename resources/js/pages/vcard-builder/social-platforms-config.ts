// Comprehensive Social Platforms Configuration
// This file contains all major social platforms that should be available across all business templates

export interface SocialPlatform {
  value: string;
  label: string;
  category: string;
  icon?: string;
  color?: string;
  placeholder?: string;
}

export const socialPlatformsConfig: SocialPlatform[] = [
  // Core Social Networks
  { value: 'facebook', label: 'Facebook', category: 'social', color: '#1877F2', placeholder: 'https://facebook.com/username' },
  { value: 'instagram', label: 'Instagram', category: 'social', color: '#E4405F', placeholder: 'https://instagram.com/username' },
  { value: 'twitter', label: 'Twitter/X', category: 'social', color: '#000000', placeholder: 'https://twitter.com/username' },
  { value: 'x', label: 'X (Twitter)', category: 'social', color: '#000000', placeholder: 'https://x.com/username' },
  { value: 'linkedin', label: 'LinkedIn', category: 'professional', color: '#0A66C2', placeholder: 'https://linkedin.com/in/username' },
  { value: 'threads', label: 'Threads', category: 'social', color: '#000000', placeholder: 'https://threads.net/@username' },

  // Video Platforms
  { value: 'youtube', label: 'YouTube', category: 'video', color: '#FF0000', placeholder: 'https://youtube.com/@username' },
  { value: 'tiktok', label: 'TikTok', category: 'video', color: '#000000', placeholder: 'https://tiktok.com/@username' },
  { value: 'twitch', label: 'Twitch', category: 'video', color: '#9146FF', placeholder: 'https://twitch.tv/username' },
  { value: 'vimeo', label: 'Vimeo', category: 'video', color: '#1AB7EA', placeholder: 'https://vimeo.com/username' },
  { value: 'rumble', label: 'Rumble', category: 'video', color: '#85C742', placeholder: 'https://rumble.com/c/username' },
  { value: 'dailymotion', label: 'Dailymotion', category: 'video', color: '#0066DC', placeholder: 'https://dailymotion.com/username' },

  // Music & Audio Platforms
  { value: 'spotify', label: 'Spotify', category: 'music', color: '#1DB954', placeholder: 'https://open.spotify.com/artist/id' },
  { value: 'apple', label: 'Apple Music', category: 'music', color: '#FA243C', placeholder: 'https://music.apple.com/artist/username' },
  { value: 'soundcloud', label: 'SoundCloud', category: 'music', color: '#FF5500', placeholder: 'https://soundcloud.com/username' },
  { value: 'bandcamp', label: 'Bandcamp', category: 'music', color: '#629AA0', placeholder: 'https://username.bandcamp.com' },
  { value: 'audiomack', label: 'Audiomack', category: 'music', color: '#FF6600', placeholder: 'https://audiomack.com/username' },
  { value: 'deezer', label: 'Deezer', category: 'music', color: '#FEAA2D', placeholder: 'https://deezer.com/artist/username' },
  { value: 'pandora', label: 'Pandora', category: 'music', color: '#005483', placeholder: 'https://pandora.com/artist/username' },

  // Professional & Creative Platforms
  { value: 'github', label: 'GitHub', category: 'professional', color: '#181717', placeholder: 'https://github.com/username' },
  { value: 'behance', label: 'Behance', category: 'creative', color: '#1769FF', placeholder: 'https://behance.net/username' },
  { value: 'dribbble', label: 'Dribbble', category: 'creative', color: '#EA4C89', placeholder: 'https://dribbble.com/username' },
  { value: 'deviantart', label: 'DeviantArt', category: 'creative', color: '#05CC47', placeholder: 'https://deviantart.com/username' },
  { value: 'artstation', label: 'ArtStation', category: 'creative', color: '#13AFF0', placeholder: 'https://artstation.com/username' },
  { value: 'figma', label: 'Figma', category: 'professional', color: '#F24E1E', placeholder: 'https://figma.com/@username' },

  // Content & Blogging Platforms
  { value: 'medium', label: 'Medium', category: 'content', color: '#000000', placeholder: 'https://medium.com/@username' },
  { value: 'substack', label: 'Substack', category: 'content', color: '#FF6719', placeholder: 'https://username.substack.com' },
  { value: 'hashnode', label: 'Hashnode', category: 'content', color: '#2962FF', placeholder: 'https://hashnode.com/@username' },
  { value: 'devto', label: 'Dev.to', category: 'content', color: '#0A0A0A', placeholder: 'https://dev.to/username' },

  // Visual & Creative Platforms
  { value: 'pinterest', label: 'Pinterest', category: 'visual', color: '#E60023', placeholder: 'https://pinterest.com/username' },
  { value: 'flickr', label: 'Flickr', category: 'visual', color: '#FF0084', placeholder: 'https://flickr.com/photos/username' },
  { value: 'unsplash', label: 'Unsplash', category: 'visual', color: '#000000', placeholder: 'https://unsplash.com/@username' },
  { value: '500px', label: '500px', category: 'visual', color: '#0099E5', placeholder: 'https://500px.com/username' },

  // Communication Platforms
  { value: 'whatsapp', label: 'WhatsApp', category: 'messaging', color: '#25D366', placeholder: 'https://wa.me/1234567890' },
  { value: 'telegram', label: 'Telegram', category: 'messaging', color: '#26A5E4', placeholder: 'https://t.me/username' },
  { value: 'discord', label: 'Discord', category: 'messaging', color: '#5865F2', placeholder: 'https://discord.gg/username' },
  { value: 'signal', label: 'Signal', category: 'messaging', color: '#3A76F0', placeholder: 'Signal: +1234567890' },
  { value: 'skype', label: 'Skype', category: 'messaging', color: '#00AFF0', placeholder: 'skype:username?chat' },

  // Social & Community Platforms
  { value: 'reddit', label: 'Reddit', category: 'community', color: '#FF4500', placeholder: 'https://reddit.com/u/username' },
  { value: 'clubhouse', label: 'Clubhouse', category: 'community', color: '#F1C40F', placeholder: 'https://clubhouse.com/@username' },
  { value: 'mastodon', label: 'Mastodon', category: 'community', color: '#6364FF', placeholder: 'https://mastodon.social/@username' },

  // Ephemeral & Stories Platforms
  { value: 'snapchat', label: 'Snapchat', category: 'ephemeral', color: '#FFFC00', placeholder: 'https://snapchat.com/add/username' },
  { value: 'bereal', label: 'BeReal', category: 'ephemeral', color: '#000000', placeholder: 'BeReal: username' },

  // Business & E-commerce Platforms
  { value: 'etsy', label: 'Etsy', category: 'ecommerce', color: '#F16521', placeholder: 'https://etsy.com/shop/username' },
  { value: 'amazon', label: 'Amazon Store', category: 'ecommerce', color: '#FF9900', placeholder: 'https://amazon.com/stores/username' },
  { value: 'shopify', label: 'Shopify Store', category: 'ecommerce', color: '#7AB55C', placeholder: 'https://username.myshopify.com' },

  // Regional & International Platforms
  // China
  { value: 'wechat', label: 'WeChat', category: 'regional', color: '#07C160', placeholder: 'WeChat ID: username' },
  { value: 'weibo', label: 'Weibo', category: 'regional', color: '#E6162D', placeholder: 'https://weibo.com/username' },
  { value: 'qq', label: 'QQ', category: 'regional', color: '#12B7F5', placeholder: 'QQ: 123456789' },
  { value: 'qzone', label: 'QZone', category: 'regional', color: '#FECE00', placeholder: 'https://user.qzone.qq.com/123456789' },
  { value: 'douyin', label: 'Douyin', category: 'regional', color: '#000000', placeholder: 'Douyin ID: username' },
  { value: 'xiaohongshu', label: 'XiaoHongShu (Little Red Book)', category: 'regional', color: '#FF2442', placeholder: 'https://xiaohongshu.com/user/username' },
  { value: 'bilibili', label: 'Bilibili', category: 'regional', color: '#00A1D6', placeholder: 'https://space.bilibili.com/username' },
  { value: 'zhihu', label: 'Zhihu', category: 'regional', color: '#0084FF', placeholder: 'https://zhihu.com/people/username' },
  
  // Japan
  { value: 'line', label: 'LINE', category: 'regional', color: '#00B900', placeholder: 'LINE ID: username' },
  { value: 'mixi', label: 'Mixi', category: 'regional', color: '#D1AD5A', placeholder: 'https://mixi.jp/username' },
  { value: 'niconico', label: 'Niconico', category: 'regional', color: '#231815', placeholder: 'https://nicovideo.jp/user/username' },
  
  // Korea
  { value: 'kakao', label: 'KakaoTalk', category: 'regional', color: '#FFCD00', placeholder: 'KakaoTalk ID: username' },
  { value: 'naver', label: 'Naver Blog', category: 'regional', color: '#03C75A', placeholder: 'https://blog.naver.com/username' },
  { value: 'cyworld', label: 'Cyworld', category: 'regional', color: '#FF6600', placeholder: 'Cyworld ID: username' },
  
  // Russia & Eastern Europe
  { value: 'vk', label: 'VKontakte', category: 'regional', color: '#4C75A3', placeholder: 'https://vk.com/username' },
  { value: 'ok', label: 'Odnoklassniki', category: 'regional', color: '#EE8208', placeholder: 'https://ok.ru/username' },
  { value: 'yandex', label: 'Yandex Zen', category: 'regional', color: '#FC3F1D', placeholder: 'https://zen.yandex.ru/username' },
  
  // India
  { value: 'sharechat', label: 'ShareChat', category: 'regional', color: '#FF5722', placeholder: 'ShareChat: @username' },
  { value: 'moj', label: 'Moj', category: 'regional', color: '#FF6B35', placeholder: 'Moj: @username' },
  { value: 'koo', label: 'Koo', category: 'regional', color: '#FFDD00', placeholder: 'https://kooapp.com/profile/username' },
  
  // Brazil
  { value: 'orkut', label: 'Orkut', category: 'regional', color: '#FF6699', placeholder: 'Orkut: username' },
  
  // Middle East
  { value: 'imo', label: 'imo', category: 'regional', color: '#1EBEA5', placeholder: 'imo: username' },
  { value: 'viber', label: 'Viber', category: 'regional', color: '#665CAC', placeholder: 'Viber: +1234567890' },
  
  // Africa
  { value: 'mxit', label: 'Mxit', category: 'regional', color: '#FF6B00', placeholder: 'Mxit: username' },
  { value: '2go', label: '2go', category: 'regional', color: '#0099CC', placeholder: '2go: username' },
  
  // Southeast Asia
  { value: 'zalo', label: 'Zalo', category: 'regional', color: '#0068FF', placeholder: 'Zalo: +84123456789' },
  { value: 'bbm', label: 'BlackBerry Messenger', category: 'regional', color: '#000000', placeholder: 'BBM PIN: 12345678' },

  // Podcast Platforms
  { value: 'anchor', label: 'Anchor', category: 'podcast', color: '#5000B9', placeholder: 'https://anchor.fm/username' },
  { value: 'podbean', label: 'Podbean', category: 'podcast', color: '#F7931E', placeholder: 'https://username.podbean.com' },
  { value: 'buzzsprout', label: 'Buzzsprout', category: 'podcast', color: '#F7931E', placeholder: 'https://buzzsprout.com/username' },

  // Learning & Education Platforms
  { value: 'udemy', label: 'Udemy', category: 'education', color: '#A435F0', placeholder: 'https://udemy.com/user/username' },
  { value: 'coursera', label: 'Coursera', category: 'education', color: '#0056D3', placeholder: 'https://coursera.org/instructor/username' },
  { value: 'skillshare', label: 'Skillshare', category: 'education', color: '#00FF88', placeholder: 'https://skillshare.com/user/username' },

  // Dating & Social Discovery
  { value: 'bumble', label: 'Bumble Bizz', category: 'networking', color: '#FFDD00', placeholder: 'Bumble Bizz: username' },

  // Fitness & Health Platforms
  { value: 'strava', label: 'Strava', category: 'fitness', color: '#FC4C02', placeholder: 'https://strava.com/athletes/username' },
  { value: 'myfitnesspal', label: 'MyFitnessPal', category: 'fitness', color: '#0072CE', placeholder: 'MyFitnessPal: username' },

  // Gaming Platforms
  { value: 'steam', label: 'Steam', category: 'gaming', color: '#171A21', placeholder: 'https://steamcommunity.com/id/username' },
  { value: 'xbox', label: 'Xbox Live', category: 'gaming', color: '#107C10', placeholder: 'Xbox Gamertag: username' },
  { value: 'playstation', label: 'PlayStation', category: 'gaming', color: '#003791', placeholder: 'PSN ID: username' },
  { value: 'epic', label: 'Epic Games', category: 'gaming', color: '#313131', placeholder: 'Epic Games: username' },

  // Custom/Other
  { value: 'website', label: 'Website', category: 'other', color: '#6B7280', placeholder: 'https://yourwebsite.com' },
  { value: 'blog', label: 'Blog', category: 'other', color: '#6B7280', placeholder: 'https://yourblog.com' },
  { value: 'portfolio', label: 'Portfolio', category: 'other', color: '#6B7280', placeholder: 'https://yourportfolio.com' },
  { value: 'custom', label: 'Custom Link', category: 'other', color: '#6B7280', placeholder: 'https://customlink.com' }
];

export const socialPlatformCategories = [
  { value: 'social', label: 'Social Networks' },
  { value: 'professional', label: 'Professional' },
  { value: 'video', label: 'Video Platforms' },
  { value: 'music', label: 'Music & Audio' },
  { value: 'creative', label: 'Creative & Design' },
  { value: 'content', label: 'Content & Blogging' },
  { value: 'visual', label: 'Visual & Photography' },
  { value: 'messaging', label: 'Messaging' },
  { value: 'community', label: 'Community' },
  { value: 'ephemeral', label: 'Stories & Ephemeral' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'regional', label: 'Regional Platforms' },
  { value: 'podcast', label: 'Podcast Platforms' },
  { value: 'education', label: 'Education & Learning' },
  { value: 'networking', label: 'Networking' },
  { value: 'fitness', label: 'Fitness & Health' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'other', label: 'Other' }
];

// Helper function to get platforms by category
export const getPlatformsByCategory = (category: string): SocialPlatform[] => {
  return socialPlatformsConfig.filter(platform => platform.category === category);
};

// Helper function to get platform by value
export const getPlatformByValue = (value: string): SocialPlatform | undefined => {
  return socialPlatformsConfig.find(platform => platform.value === value);
};

// Helper function to get all platform values for select options
export const getAllPlatformOptions = () => {
  return socialPlatformsConfig.map(platform => ({
    value: platform.value,
    label: platform.label
  }));
};