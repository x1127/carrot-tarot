import {
  Moon, Sun, Star, Sparkles, BookOpen, History, Palette, Image as ImageIcon,
  Settings, Key, Crown, Gem, Flame, Heart, Eye, Zap, Feather, Scroll,
  Wand2, Ghost, Cloud, Compass, Award, FlaskConical, TreePine, Anchor,
  Bird, Snowflake, Droplet, Wind, Leaf, Flower, Hexagon, Triangle,
  Circle, Square, Diamond, Fingerprint, Infinity, Atom, Orbit,
  type LucideIcon,
} from 'lucide-react';
import { useAdminConfigStore } from '../store/adminConfig';
import type { CustomIcon } from '../store/adminConfig';

type IconComponent = LucideIcon;

// 预设图标注册表：图标名 -> 组件
export const ICON_REGISTRY: Record<string, IconComponent> = {
  Moon, Sun, Star, Sparkles, BookOpen, History, Palette, Image: ImageIcon,
  Settings, Key, Crown, Gem, Flame, Heart, Eye, Zap, Feather, Scroll,
  Wand2, Ghost, Cloud, Compass, Award, FlaskConical, TreePine, Anchor,
  Bird, Snowflake, Droplet, Wind, Leaf, Flower, Hexagon, Triangle,
  Circle, Square, Diamond, Fingerprint, Infinity, Atom, Orbit,
};

// 供设置页展示的分组图标列表
export const PRESET_ICON_GROUPS: { group: string; icons: { name: string; Icon: IconComponent }[] }[] = [
  {
    group: '天体与自然',
    icons: ['Moon', 'Sun', 'Star', 'Cloud', 'Snowflake', 'Droplet', 'Wind', 'Leaf', 'Flower', 'TreePine', 'Bird', 'Flame']
      .map((n) => ({ name: n, Icon: ICON_REGISTRY[n] })),
  },
  {
    group: '神秘与象征',
    icons: ['Sparkles', 'Eye', 'Crown', 'Gem', 'Wand2', 'Scroll', 'Feather', 'Ghost', 'Hexagon', 'Triangle', 'Circle', 'Diamond', 'Infinity', 'Atom', 'Orbit', 'Fingerprint']
      .map((n) => ({ name: n, Icon: ICON_REGISTRY[n] })),
  },
  {
    group: '功能与导航',
    icons: ['BookOpen', 'History', 'Palette', 'Image', 'Settings', 'Key', 'Compass', 'Award', 'Anchor', 'FlaskConical', 'Heart', 'Zap']
      .map((n) => ({ name: n, Icon: ICON_REGISTRY[n] })),
  },
];

interface ModuleIconProps {
  /** 图标配置键，如 'nav.logo'、'home.feature.deck' */
  name: string;
  /** 默认 lucide 图标（未配置时使用） */
  fallback: IconComponent;
  /** 尺寸 px，默认 24 */
  size?: number;
  /** 额外 className（颜色等） */
  className?: string;
}

export default function ModuleIcon({ name, fallback, size = 24, className }: ModuleIconProps) {
  const icon: CustomIcon | undefined = useAdminConfigStore((state) => state.config.icons[name]);

  // 未配置 -> 使用默认图标
  if (!icon) {
    const Fallback = fallback;
    return <Fallback size={size} className={className} />;
  }

  // 预设图标
  if (icon.type === 'preset') {
    const Comp = ICON_REGISTRY[icon.value] || fallback;
    return <Comp size={size} className={className} />;
  }

  // emoji
  if (icon.type === 'emoji') {
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          fontSize: size * 0.9,
          lineHeight: 1,
        }}
      >
        {icon.value}
      </span>
    );
  }

  // 图片
  if (icon.type === 'image') {
    return (
      <img
        src={icon.value}
        alt=""
        className={className}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
        }}
      />
    );
  }

  return null;
}
