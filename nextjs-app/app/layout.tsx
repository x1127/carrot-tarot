import type { Metadata } from "next";
import { ZCOOL_KuaiLe, Ma_Shan_Zheng, Cinzel, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { ContentProvider } from "@/components/ContentProvider";
import { SiteShell } from "@/components/shell/SiteShell";

const zcool = ZCOOL_KuaiLe({
  weight: "400",
  variable: "--font-zcool",
  subsets: ["latin"],
  display: "swap",
});

const mashan = Ma_Shan_Zheng({
  weight: "400",
  variable: "--font-mashan",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  weight: ["400", "700"],
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const noto = Noto_Sans_SC({
  weight: ["400", "500", "700"],
  variable: "--font-noto",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "胡萝卜塔罗 · Carrot Tarot",
  description:
    "一只戴尖帽的胡萝卜，在像素森林里翻牌。78 张手绘牌面，治愈又怪诞的命运小剧场。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${zcool.variable} ${mashan.variable} ${cinzel.variable} ${noto.variable}`}>
      <body>
        <ContentProvider>
          <SiteShell>{children}</SiteShell>
        </ContentProvider>
      </body>
    </html>
  );
}
