"use client";

import { Suspense, lazy, useState } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CalendarClock,
  Check,
  Clapperboard,
  Coins,
  Gamepad2,
  GraduationCap,
  Network,
  ShoppingCart,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nhl-27.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "NHL 27 Wiki",
        description:
          "Complete NHL 27 Wiki tracking EA SPORTS NHL 27 release news, reveal trailer, confirmed PS5 and Xbox Series X|S platforms, gameplay, modes, ratings, editions, and official updates.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "NHL 27 - Next-Gen Ice Hockey Simulation",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "NHL 27 Wiki",
        alternateName: "NHL 27",
        url: siteUrl,
        description:
          "Complete NHL 27 Wiki resource hub tracking EA SPORTS NHL 27 release news, reveal trailer, platforms, editions, modes, ratings, and official updates",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "NHL 27 Wiki - Next-Gen Ice Hockey Simulation",
        },
        sameAs: [
          "https://www.ea.com/games/nhl/nhl-27",
          "https://www.reddit.com/r/EA_NHL/",
          "https://www.youtube.com/@EASPORTSNHL",
          "https://x.com/EASPORTSNHL",
        ],
      },
      {
        "@type": "VideoGame",
        name: "NHL 27",
        gamePlatform: ["PlayStation 5", "Xbox Series X|S"],
        applicationCategory: "Game",
        genre: ["Sports", "Ice Hockey", "Simulation"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 12,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/PreOrder",
          url: "https://www.ea.com/games/nhl/nhl-27",
        },
      },
      {
        "@type": "VideoObject",
        name: "EA SPORTS NHL Reveal Trailer",
        description:
          "EA SPORTS NHL reveal trailer. Placeholder until the NHL 27 reveal trailer drops on July 16, 2026.",
        uploadDate: "2025-08-20",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/TI79ySF0N0g",
        url: "https://www.youtube.com/watch?v=TI79ySF0N0g",
      },
    ],
  };

  // Module 8 (Game Modes) tab state
  const [activeModeTab, setActiveModeTab] = useState(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Tools Grid 卡片 → 模块锚点映射（顺序与 8 模块一致）
  const toolSectionIds = [
    "release-date-platforms",
    "trailer-cover-athlete",
    "pre-order-editions",
    "gameplay-features",
    "beginner-guide-controls",
    "player-ratings",
    "hut-guide",
    "game-modes",
  ];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold leading-[1.05] sm:text-5xl md:mb-6 md:text-7xl">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <a
                href="https://www.ea.com/games/nhl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="h-5 w-5" />
                {t.hero.getFreeCodesCTA}
              </a>
              <a
                href="https://www.ea.com/games/nhl/nhl-27"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="TI79ySF0N0g"
              title="EA SPORTS NHL Reveal Trailer"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards */}
      <section className="bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base text-muted-foreground md:text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = toolSectionIds[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 bg-card
                             hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg bg-[hsl(var(--nav-theme)/0.1)]
                                flex items-center justify-center
                                group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                transition-colors md:mb-4 md:h-12 md:w-12"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 text-[hsl(var(--nav-theme-light))] md:h-6 md:w-6"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold md:text-base">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Module 1: NHL 27 Release Date and Platforms */}
      <section id="release-date-platforms" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <div className="mb-4 flex items-center justify-center gap-3">
              <CalendarClock className="h-8 w-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl font-bold md:text-5xl">
                {t.modules.nhlReleaseDatePlatforms.title}
              </h2>
            </div>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.nhlReleaseDatePlatforms.intro}
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 scroll-reveal sm:grid-cols-2 lg:grid-cols-3">
            {t.modules.nhlReleaseDatePlatforms.items.map((item: any, index: number) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-white/5 p-6 hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </p>
                <p className="mb-2 text-xl font-bold text-[hsl(var(--nav-theme-light))] md:text-2xl">
                  {item.value}
                </p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="scroll-reveal rounded-xl border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.05)] p-4 md:p-6">
            <div className="mb-3 flex items-center gap-2 md:mb-4">
              <BookOpen className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="text-base font-bold md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.nhlReleaseDatePlatforms.quickTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 2: NHL 27 Trailer and Cover Athlete */}
      <section id="trailer-cover-athlete" className="scroll-mt-24 bg-white/[0.02] px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <div className="mb-4 flex items-center justify-center gap-3">
              <Clapperboard className="h-8 w-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl font-bold md:text-5xl">
                {t.modules.nhlTrailerCoverAthlete.title}
              </h2>
            </div>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.nhlTrailerCoverAthlete.intro}
            </p>
          </div>

          <div className="relative space-y-8 border-l-2 border-[hsl(var(--nav-theme)/0.3)] pl-6 scroll-reveal">
            {t.modules.nhlTrailerCoverAthlete.entries.map((entry: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.4rem] h-4 w-4 rounded-full border-2 border-background bg-[hsl(var(--nav-theme))]" />
                <div className="rounded-xl border border-border bg-white/5 p-5 hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-2 py-1 text-xs">
                      {entry.type}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarClock className="h-4 w-4" />
                      {entry.date}
                    </span>
                  </div>
                  <h3 className="mb-1 font-bold">{entry.title}</h3>
                  <p className="text-sm text-muted-foreground">{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: NHL 27 Pre-Order Editions and Early Access */}
      <section id="pre-order-editions" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <div className="mb-4 flex items-center justify-center gap-3">
              <ShoppingCart className="h-8 w-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl font-bold md:text-5xl">
                {t.modules.nhlPreOrderEditions.title}
              </h2>
            </div>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.nhlPreOrderEditions.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 scroll-reveal md:grid-cols-2 lg:grid-cols-3">
            {t.modules.nhlPreOrderEditions.options.map((opt: any, index: number) => (
              <div
                key={index}
                className="flex flex-col rounded-xl border border-border bg-white/5 p-6 hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <h3 className="mb-3 text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                  {opt.option}
                </h3>
                <dl className="mb-3 space-y-1.5 text-sm">
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Availability</dt>
                    <dd className="text-right font-medium">{opt.availability}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Price</dt>
                    <dd className="text-right font-medium">{opt.price}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Early Access</dt>
                    <dd className="text-right font-medium">{opt.earlyAccess}</dd>
                  </div>
                </dl>
                <p className="mb-3 text-sm text-muted-foreground">{opt.bonuses}</p>
                <p className="mt-auto flex items-center gap-1 text-xs text-muted-foreground">
                  <Gamepad2 className="h-3.5 w-3.5" />
                  {opt.platforms}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: NHL 27 Gameplay Features and Changes */}
      <section id="gameplay-features" className="scroll-mt-24 bg-white/[0.02] px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <div className="mb-4 flex items-center justify-center gap-3">
              <Activity className="h-8 w-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl font-bold md:text-5xl">
                {t.modules.nhlGameplayFeatures.title}
              </h2>
            </div>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.nhlGameplayFeatures.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 scroll-reveal md:grid-cols-2">
            {t.modules.nhlGameplayFeatures.features.map((f: any, index: number) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-white/5 p-6 hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <h3 className="mb-3 flex items-center gap-2 font-bold">
                  <Activity className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                  {f.category}
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                      NHL 27
                    </p>
                    <p className="text-muted-foreground">{f.nhl27}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                      NHL 26 Baseline
                    </p>
                    <p className="text-muted-foreground">{f.nhl26Baseline}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 模块阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 5: NHL 27 Beginner Guide and Controls */}
      <section id="beginner-guide-controls" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <div className="mb-4 flex items-center justify-center gap-3">
              <GraduationCap className="h-8 w-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl font-bold md:text-5xl">
                {t.modules.nhlBeginnerGuideControls.title}
              </h2>
            </div>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.nhlBeginnerGuideControls.intro}
            </p>
          </div>

          <div className="mb-8 space-y-3 scroll-reveal md:space-y-4">
            {t.modules.nhlBeginnerGuideControls.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 rounded-xl border border-border bg-white/5 p-4 hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors md:gap-4 md:p-6"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)] md:h-12 md:w-12">
                  <span className="text-base font-bold text-[hsl(var(--nav-theme-light))] md:text-xl">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="mb-1.5 text-lg font-bold md:mb-2 md:text-xl">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground md:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="scroll-reveal rounded-xl border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.05)] p-4 md:p-6">
            <div className="mb-3 flex items-center gap-2 md:mb-4">
              <BookOpen className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="text-base font-bold md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.nhlBeginnerGuideControls.quickTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 6: NHL 27 Player Ratings and Best Players */}
      <section id="player-ratings" className="scroll-mt-24 bg-white/[0.02] px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <div className="mb-4 flex items-center justify-center gap-3">
              <Trophy className="h-8 w-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl font-bold md:text-5xl">
                {t.modules.nhlPlayerRatings.title}
              </h2>
            </div>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.nhlPlayerRatings.intro}
            </p>
          </div>

          <div className="space-y-6 scroll-reveal">
            {t.modules.nhlPlayerRatings.groups.map((group: any, gi: number) => (
              <div
                key={gi}
                className="rounded-xl border border-border bg-white/5 p-6"
              >
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <Trophy className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                  {group.name}
                </h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {group.players.map((p: any, pi: number) => (
                    <div
                      key={pi}
                      className="rounded-lg border border-border bg-white/5 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="font-semibold">{p.name}</span>
                        <span className="text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                          {p.overall}
                        </span>
                      </div>
                      <div className="mb-2 flex flex-wrap gap-1.5 text-xs">
                        <span className="rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-2 py-0.5">
                          {p.position}
                        </span>
                        <span className="rounded-full border border-border bg-white/5 px-2 py-0.5 text-muted-foreground">
                          {p.team}
                        </span>
                        <span className="rounded-full border border-border bg-white/5 px-2 py-0.5 text-muted-foreground">
                          {p.style}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{p.strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 7: NHL 27 Hockey Ultimate Team Guide */}
      <section id="hut-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <div className="mb-4 flex items-center justify-center gap-3">
              <Coins className="h-8 w-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl font-bold md:text-5xl">
                {t.modules.nhlHutGuide.title}
              </h2>
            </div>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.nhlHutGuide.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 scroll-reveal md:grid-cols-2 lg:grid-cols-3">
            {t.modules.nhlHutGuide.cards.map((c: any, index: number) => (
              <div
                key={index}
                className="flex flex-col rounded-xl border border-border bg-white/5 p-6 hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <span className="mb-3 inline-block w-fit rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-2 py-1 text-xs">
                  {c.category}
                </span>
                <h3 className="mb-2 text-lg font-bold">{c.title}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{c.summary}</p>
                <ul className="mt-auto space-y-2">
                  {c.actions.map((a: string, ai: number) => (
                    <li key={ai} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                      <span className="text-muted-foreground">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: NHL 27 Be A Pro, Franchise, and World of Chel */}
      <section id="game-modes" className="scroll-mt-24 bg-white/[0.02] px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <div className="mb-4 flex items-center justify-center gap-3">
              <Network className="h-8 w-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl font-bold md:text-5xl">
                {t.modules.nhlGameModes.title}
              </h2>
            </div>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.nhlGameModes.intro}
            </p>
          </div>

          {/* Mode tabs */}
          <div className="mb-8 flex flex-wrap justify-center gap-2 scroll-reveal">
            {t.modules.nhlGameModes.tabs.map((tab: any, index: number) => (
              <button
                key={index}
                onClick={() => setActiveModeTab(index)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors md:text-base ${
                  activeModeTab === index
                    ? "border-[hsl(var(--nav-theme))] bg-[hsl(var(--nav-theme)/0.15)] text-[hsl(var(--nav-theme-light))]"
                    : "border-border bg-white/5 text-muted-foreground hover:bg-white/10"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Active tab content */}
          {t.modules.nhlGameModes.tabs[activeModeTab] && (
            <div className="rounded-xl border border-border bg-white/5 p-6 scroll-reveal md:p-8">
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
                <Star className="h-4 w-4" />
                {t.modules.nhlGameModes.tabs[activeModeTab].bestFor}
              </p>
              <p className="mb-6 text-muted-foreground">
                {t.modules.nhlGameModes.tabs[activeModeTab].summary}
              </p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-bold">
                    <Check className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {t.modules.nhlGameModes.tabs[activeModeTab].features.map(
                      (feature: string, fi: number) => (
                        <li key={fi} className="flex items-start gap-2 text-sm">
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-bold">
                    <ArrowRight className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                    First Steps
                  </h3>
                  <ol className="space-y-2">
                    {t.modules.nhlGameModes.tabs[activeModeTab].firstSteps.map(
                      (step: string, si: number) => (
                        <li key={si} className="flex items-start gap-2 text-sm">
                          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] text-xs font-bold text-[hsl(var(--nav-theme-light))]">
                            {si + 1}
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ),
                    )}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="border-t border-border bg-white/[0.02]">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div>
              <h3 className="mb-4 text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="mb-4 font-semibold">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.reddit.com/r/EA_NHL/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.reddit}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/EASPORTSNHL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@EASPORTSNHL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/easportsnhl/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.instagram}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="mb-4 font-semibold">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="mb-2 text-sm text-muted-foreground">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
