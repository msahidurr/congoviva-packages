import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SocialSectionProps {
  social: {
    items: Array<{
      platform: string;
      url: string;
      icon: string;
    }>;
    display: boolean;
  };
  onUpdate: (field: string, value: any) => void;
}

export default function SocialSection({ social, onUpdate }: SocialSectionProps) {
  const { t } = useTranslation();
  
  // Ensure social items are properly initialized
  const safeSocial = {
    items: Array.isArray(social.items) ? social.items.map(item => ({
      platform: item.platform || '',
      url: item.url || '',
      icon: item.icon || ''
    })) : [],
    display: !!social.display
  };
  
  const socialPlatforms = [
    { value: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/username' },
    { value: 'twitter', label: 'Twitter', placeholder: 'https://twitter.com/username' },
    { value: 'x', label: 'X (Twitter)', placeholder: 'https://x.com/username' },
    { value: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
    { value: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
    { value: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/c/username' },
    { value: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@username' },
    { value: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
    { value: 'pinterest', label: 'Pinterest', placeholder: 'https://pinterest.com/username' },
    { value: 'snapchat', label: 'Snapchat', placeholder: 'https://snapchat.com/add/username' },
    { value: 'discord', label: 'Discord', placeholder: 'https://discord.gg/invite' },
    { value: 'twitch', label: 'Twitch', placeholder: 'https://twitch.tv/username' },
    { value: 'reddit', label: 'Reddit', placeholder: 'https://reddit.com/user/username' },
    { value: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/phonenumber' },
    { value: 'telegram', label: 'Telegram', placeholder: 'https://t.me/username' },
    { value: 'medium', label: 'Medium', placeholder: 'https://medium.com/@username' },
    { value: 'dribbble', label: 'Dribbble', placeholder: 'https://dribbble.com/username' },
    { value: 'behance', label: 'Behance', placeholder: 'https://behance.net/username' },
    { value: 'vimeo', label: 'Vimeo', placeholder: 'https://vimeo.com/username' },
    { value: 'spotify', label: 'Spotify', placeholder: 'https://open.spotify.com/user/username' },
    { value: 'soundcloud', label: 'SoundCloud', placeholder: 'https://soundcloud.com/username' },
    { value: 'threads', label: 'Threads', placeholder: 'https://threads.net/@username' },
    { value: 'rumble', label: 'Rumble', placeholder: 'https://rumble.com/c/username' },
    { value: 'dailymotion', label: 'Dailymotion', placeholder: 'https://dailymotion.com/username' },
    { value: 'audiomack', label: 'Audiomack', placeholder: 'https://audiomack.com/username' },
    { value: 'deezer', label: 'Deezer', placeholder: 'https://deezer.com/profile/username' },
    { value: 'pandora', label: 'Pandora', placeholder: 'https://pandora.com/profile/username' },
    { value: 'deviantart', label: 'DeviantArt', placeholder: 'https://deviantart.com/username' },
    { value: 'artstation', label: 'ArtStation', placeholder: 'https://artstation.com/username' },
    { value: 'figma', label: 'Figma', placeholder: 'https://figma.com/@username' },
    { value: 'substack', label: 'Substack', placeholder: 'https://username.substack.com' },
    { value: 'hashnode', label: 'Hashnode', placeholder: 'https://hashnode.com/@username' },
    { value: 'devto', label: 'Dev.to', placeholder: 'https://dev.to/username' },
    { value: 'flickr', label: 'Flickr', placeholder: 'https://flickr.com/photos/username' },
    { value: 'unsplash', label: 'Unsplash', placeholder: 'https://unsplash.com/@username' },
    { value: '500px', label: '500px', placeholder: 'https://500px.com/username' },
    { value: 'signal', label: 'Signal', placeholder: 'https://signal.me/#p/username' },
    { value: 'skype', label: 'Skype', placeholder: 'skype:username?chat' },
    { value: 'clubhouse', label: 'Clubhouse', placeholder: 'https://clubhouse.com/@username' },
    { value: 'mastodon', label: 'Mastodon', placeholder: 'https://mastodon.social/@username' },
    { value: 'bereal', label: 'BeReal', placeholder: 'https://bere.al/username' },
    { value: 'etsy', label: 'Etsy', placeholder: 'https://etsy.com/shop/username' },
    { value: 'amazon', label: 'Amazon', placeholder: 'https://amazon.com/shops/username' },
    { value: 'shopify', label: 'Shopify', placeholder: 'https://username.myshopify.com' },
    { value: 'wechat', label: 'WeChat', placeholder: 'WeChat ID: username' },
    { value: 'weibo', label: 'Weibo', placeholder: 'https://weibo.com/username' },
    { value: 'line', label: 'Line', placeholder: 'https://line.me/ti/p/username' },
    { value: 'kakao', label: 'KakaoTalk', placeholder: 'https://open.kakao.com/o/username' },
    { value: 'vk', label: 'VKontakte', placeholder: 'https://vk.com/username' },
    { value: 'ok', label: 'Odnoklassniki', placeholder: 'https://ok.ru/username' },
    { value: 'anchor', label: 'Anchor', placeholder: 'https://anchor.fm/username' },
    { value: 'podbean', label: 'Podbean', placeholder: 'https://username.podbean.com' },
    { value: 'buzzsprout', label: 'Buzzsprout', placeholder: 'https://username.buzzsprout.com' },
    { value: 'udemy', label: 'Udemy', placeholder: 'https://udemy.com/user/username' },
    { value: 'coursera', label: 'Coursera', placeholder: 'https://coursera.org/instructor/username' },
    { value: 'skillshare', label: 'Skillshare', placeholder: 'https://skillshare.com/profile/username' },
    { value: 'strava', label: 'Strava', placeholder: 'https://strava.com/athletes/username' },
    { value: 'myfitnesspal', label: 'MyFitnessPal', placeholder: 'https://myfitnesspal.com/profile/username' },
    { value: 'steam', label: 'Steam', placeholder: 'https://steamcommunity.com/id/username' },
    { value: 'xbox', label: 'Xbox', placeholder: 'https://account.xbox.com/profile?gamertag=username' },
    { value: 'playstation', label: 'PlayStation', placeholder: 'https://psnprofiles.com/username' },
    { value: 'epic', label: 'Epic Games', placeholder: 'Epic Games ID: username' },
    { value: 'qq', label: 'QQ', placeholder: 'QQ: username' },
    { value: 'qzone', label: 'QZone', placeholder: 'https://user.qzone.qq.com/username' },
    { value: 'douyin', label: 'Douyin', placeholder: 'https://douyin.com/@username' },
    { value: 'xiaohongshu', label: 'Xiaohongshu', placeholder: 'https://xiaohongshu.com/user/profile/username' },
    { value: 'bilibili', label: 'Bilibili', placeholder: 'https://space.bilibili.com/username' },
    { value: 'zhihu', label: 'Zhihu', placeholder: 'https://zhihu.com/people/username' },
    { value: 'mixi', label: 'Mixi', placeholder: 'https://mixi.jp/show_friend.pl?id=username' },
    { value: 'niconico', label: 'Niconico', placeholder: 'https://nicovideo.jp/user/username' },
    { value: 'naver', label: 'Naver', placeholder: 'https://blog.naver.com/username' },
    { value: 'cyworld', label: 'Cyworld', placeholder: 'https://cyworld.com/username' },
    { value: 'yandex', label: 'Yandex', placeholder: 'https://yandex.com/collections/user/username' },
    { value: 'sharechat', label: 'ShareChat', placeholder: 'https://sharechat.com/profile/username' },
    { value: 'moj', label: 'Moj', placeholder: 'https://moj.app/profile/username' },
    { value: 'koo', label: 'Koo', placeholder: 'https://kooapp.com/profile/username' },
    { value: 'orkut', label: 'Orkut', placeholder: 'Orkut profile: username' },
    { value: 'imo', label: 'imo', placeholder: 'imo: username' },
    { value: 'viber', label: 'Viber', placeholder: 'viber://contact?number=username' },
    { value: 'mxit', label: 'Mxit', placeholder: 'Mxit: username' },
    { value: '2go', label: '2go', placeholder: '2go: username' },
    { value: 'zalo', label: 'Zalo', placeholder: 'https://zalo.me/username' },
    { value: 'bbm', label: 'BBM', placeholder: 'BBM PIN: username' },
    { value: 'apple', label: 'Apple', placeholder: 'https://apps.apple.com/developer/username' },
    { value: 'bumble', label: 'Bumble', placeholder: 'Bumble profile: username' },
    { value: 'bandcamp', label: 'Bandcamp', placeholder: 'https://username.bandcamp.com' },
    { value: 'chef-culinary', label: 'Chef Culinary', placeholder: 'https://chef.io/username' },
    { value: 'website', label: 'Website', placeholder: 'https://yourwebsite.com' },
    { value: 'blog', label: 'Blog', placeholder: 'https://yourblog.com' },
    { value: 'portfolio', label: 'Portfolio', placeholder: 'https://yourportfolio.com' },
    { value: 'custom', label: 'Custom', placeholder: 'https://your-custom-link.com' },
  ];
  
  return (
    <div className="space-y-3">      
      <div className="flex justify-between items-center mb-3">
        <Label className="text-sm font-medium">{t("Social Media Accounts")}</Label>
        <Switch
          checked={safeSocial.display}
          onCheckedChange={(checked) => onUpdate('display', checked)}
          className="scale-75"
        />
      </div>
      
      <div className="space-y-3">
        {safeSocial.items.map((item, index) => (
          <div key={index} className="flex items-end gap-2 border p-3 rounded-md">
            <div className="flex-1">
              <Label className="text-xs mb-1 block">{t("Platform")}</Label>
              <Select 
                value={item.platform} 
                onValueChange={(value) => {
                  const items = [...safeSocial.items];
                  items[index].platform = value;
                  items[index].icon = value;
                  onUpdate('items', items);
                }}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map(platform => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-[2]">
              <Label className="text-xs mb-1 block">{t("URL")}</Label>
              <Input
                value={item.url}
                onChange={(e) => {
                  const items = [...safeSocial.items];
                  items[index].url = e.target.value;
                  onUpdate('items', items);
                }}
                className="h-9 text-sm"
                placeholder={socialPlatforms.find(p => p.value === item.platform)?.placeholder || ''}
              />
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-9 w-9 p-0"
              onClick={() => {
                const items = [...safeSocial.items];
                items.splice(index, 1);
                onUpdate('items', items);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button 
          type="button" 
          className="w-full"
          onClick={() => {
            const items = [...safeSocial.items];
            items.push({ platform: 'facebook', url: '', icon: 'facebook' });
            onUpdate('items', items);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          {t("Add Social")}
        </Button>
      </div>
    </div>
  );
}