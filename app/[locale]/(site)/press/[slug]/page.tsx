import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { Contact } from "@/components/ui/Contact";
import { PosterSlider } from "@/components/ui/PosterSlider";
import { SplitLines } from "@/components/ui/SplitLines";
import { getI18n, pageMetadata } from "@/i18n/server";
import { articleSlugs } from "@/lib/content";
import "./page.css";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articleSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { content } = await getI18n();
  const article = content.articles.find((item) => item.slug === slug);
  if (!article) return {};
  const metadata = await pageMetadata(`/press/${slug}`, article.title, article.body[0]);
  return article.sample ? { ...metadata, robots: { index: false, follow: true } } : metadata;
}

export default function ArticlePage({ params }: PageProps) {
  return (
    <Suspense fallback={null}>
      <ArticleContent params={params} />
    </Suspense>
  );
}

async function ArticleContent({ params }: PageProps) {
  const { slug } = await params;
  const { t, content } = await getI18n();
  const article = content.articles.find((item) => item.slug === slug);
  if (!article) notFound();

  return (
    <>
      <article className="post">
        <header className="post__header box">
          <p className="post__meta">
            <time>{article.date}</time>
            <span>{article.author}</span>
            <span>{t.press.categories[article.category]}</span>
          </p>
          <SplitLines as="h1" className="post__title display">
            {article.title}
          </SplitLines>
        </header>
        <PosterSlider
          images={article.posters}
          alt={article.title}
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="post__figure"
          preload
        />
        <div className="post__body box">
          {article.body.map((paragraph) => (
            <p key={paragraph} className="serif">
              {paragraph}
            </p>
          ))}
          <TransitionLink href="/press" className="post__back display">
            {t.press.back}
          </TransitionLink>
        </div>
      </article>
      <Contact flow />
    </>
  );
}
