import type { Schema, Struct } from '@strapi/strapi';

export interface SiteAboutSection extends Struct.ComponentSchema {
  collectionName: 'components_site_about_sections';
  info: {
    description: '\u5173\u4E8E\u6211\u9875\u7684\u521B\u4F5C\u8005\u4ECB\u7ECD\u4E0E IP \u6545\u4E8B';
    displayName: '\u5173\u4E8E\u6211\u6587\u6848';
    icon: 'user';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    creatorName: Schema.Attribute.String;
    imageUrl: Schema.Attribute.String;
    ipStory: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SiteContactSection extends Struct.ComponentSchema {
  collectionName: 'components_site_contact_sections';
  info: {
    description: '\u8054\u7CFB\u65B9\u5F0F\u9875\u7684\u6807\u9898\u4E0E\u793E\u4EA4\u94FE\u63A5';
    displayName: '\u8054\u7CFB\u65B9\u5F0F\u6587\u6848';
    icon: 'mail';
  };
  attributes: {
    email: Schema.Attribute.Email;
    showForm: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    socialLinks: Schema.Attribute.Component<'site.social-link', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SiteDeckSection extends Struct.ComponentSchema {
  collectionName: 'components_site_deck_sections';
  info: {
    description: '\u724C\u7EC4\u5927\u5168\u9875\u7684\u6807\u9898\u4E0E\u7B5B\u9009\u9879\u6587\u6848';
    displayName: '\u724C\u7EC4\u9875\u6587\u6848';
    icon: 'grid';
  };
  attributes: {
    arcanaMajor: Schema.Attribute.String;
    arcanaMinor: Schema.Attribute.String;
    emptyText: Schema.Attribute.String;
    filterAll: Schema.Attribute.String;
    filterCups: Schema.Attribute.String;
    filterMajor: Schema.Attribute.String;
    filterPentacles: Schema.Attribute.String;
    filterSwords: Schema.Attribute.String;
    filterWands: Schema.Attribute.String;
    reversedLabel: Schema.Attribute.String;
    reversedMeaningLabel: Schema.Attribute.String;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
    uprightLabel: Schema.Attribute.String;
    uprightMeaningLabel: Schema.Attribute.String;
  };
}

export interface SiteDivineSection extends Struct.ComponentSchema {
  collectionName: 'components_site_divine_sections';
  info: {
    description: '\u81EA\u5B9A\u4E49\u5360\u535C\u9875\u7684\u6B65\u9AA4\u4E0E\u6309\u94AE\u6587\u6848';
    displayName: '\u5360\u535C\u9875\u6587\u6848';
    icon: 'wand';
  };
  attributes: {
    drawButtonText: Schema.Attribute.String;
    freeCountLabel: Schema.Attribute.String;
    noQuestionLabel: Schema.Attribute.String;
    questionLabel: Schema.Attribute.String;
    questionPlaceholder: Schema.Attribute.Text;
    reselectSpread: Schema.Attribute.String;
    shufflingText: Schema.Attribute.String;
    stepDrawing: Schema.Attribute.String;
    stepQuestion: Schema.Attribute.String;
    stepResult: Schema.Attribute.String;
    stepSelect: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SiteFeature extends Struct.ComponentSchema {
  collectionName: 'components_site_features';
  info: {
    description: '\u9996\u9875\u529F\u80FD\u5BFC\u822A\u5361\u7247';
    displayName: '\u529F\u80FD\u5361\u7247';
    icon: 'grid';
  };
  attributes: {
    desc: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SiteHistorySection extends Struct.ComponentSchema {
  collectionName: 'components_site_history_sections';
  info: {
    description: '\u5386\u53F2\u8BB0\u5F55\u9875\u7684\u6807\u9898\u4E0E\u7A7A\u72B6\u6001\u6587\u6848';
    displayName: '\u5386\u53F2\u9875\u6587\u6848';
    icon: 'clock';
  };
  attributes: {
    aiLabel: Schema.Attribute.String;
    clearButtonText: Schema.Attribute.String;
    clearConfirm: Schema.Attribute.String;
    emptyCta: Schema.Attribute.String;
    emptyEmoji: Schema.Attribute.String;
    emptyText: Schema.Attribute.String;
    noQuestionLabel: Schema.Attribute.String;
    subtitleTemplate: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SiteHomeSection extends Struct.ComponentSchema {
  collectionName: 'components_site_home_sections';
  info: {
    description: '\u9996\u9875 Hero \u4E0E\u529F\u80FD\u5361\u7247\u6587\u6848';
    displayName: '\u9996\u9875\u5185\u5BB9';
    icon: 'home';
  };
  attributes: {
    ctaPrimary: Schema.Attribute.String;
    ctaSecondary: Schema.Attribute.String;
    features: Schema.Attribute.Component<'site.feature', true>;
    heroEmoji: Schema.Attribute.String;
    heroSubtitle: Schema.Attribute.Text;
    heroTitle: Schema.Attribute.String;
    sectionSubtitle: Schema.Attribute.String;
    sectionTitle: Schema.Attribute.String;
    statsText: Schema.Attribute.String;
  };
}

export interface SiteSiteInfo extends Struct.ComponentSchema {
  collectionName: 'components_site_site_infos';
  info: {
    description: '\u5168\u7AD9\u7EA7\u6587\u6848';
    displayName: '\u7AD9\u70B9\u4FE1\u606F';
    icon: 'globe';
  };
  attributes: {
    footerText: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    nameEn: Schema.Attribute.String;
  };
}

export interface SiteSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_site_social_links';
  info: {
    description: '\u8054\u7CFB\u65B9\u5F0F\u9875\u7684\u793E\u4EA4\u5A92\u4F53\u94FE\u63A5';
    displayName: '\u793E\u4EA4\u94FE\u63A5';
    icon: 'link';
  };
  attributes: {
    icon: Schema.Attribute.String;
    platform: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface TarotKeyword extends Struct.ComponentSchema {
  collectionName: 'components_tarot_keywords';
  info: {
    description: '\u6B63/\u9006\u4F4D\u5173\u952E\u8BCD';
    displayName: '\u5173\u952E\u8BCD';
    icon: 'bullet-list';
  };
  attributes: {
    word: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface TarotSpreadPosition extends Struct.ComponentSchema {
  collectionName: 'components_tarot_spread_positions';
  info: {
    description: '\u724C\u9635\u4E2D\u4E00\u4E2A\u4F4D\u7F6E\u53CA\u5176\u542B\u4E49';
    displayName: '\u724C\u9635\u4F4D\u7F6E';
    icon: 'drag';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    meaning: Schema.Attribute.String;
  };
}

export interface ThemeSticker extends Struct.ComponentSchema {
  collectionName: 'components_theme_stickers';
  info: {
    description: '\u6F02\u6D6E\u4E8E\u50CF\u7D20\u80CC\u666F\u4E4B\u4E0A\u7684\u5361\u901A\u8D34\u7EB8';
    displayName: '\u6D6E\u52A8\u8D34\u7EB8';
    icon: 'picture';
  };
  attributes: {
    floatRange: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<12>;
    floatSpeed: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<4>;
    left: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<10>;
    size: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<96>;
    src: Schema.Attribute.String & Schema.Attribute.Required;
    top: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<10>;
    zIndex: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<5>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'site.about-section': SiteAboutSection;
      'site.contact-section': SiteContactSection;
      'site.deck-section': SiteDeckSection;
      'site.divine-section': SiteDivineSection;
      'site.feature': SiteFeature;
      'site.history-section': SiteHistorySection;
      'site.home-section': SiteHomeSection;
      'site.site-info': SiteSiteInfo;
      'site.social-link': SiteSocialLink;
      'tarot.keyword': TarotKeyword;
      'tarot.spread-position': TarotSpreadPosition;
      'theme.sticker': ThemeSticker;
    }
  }
}
