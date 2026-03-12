"use cache";

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import ProductActions from "@/components/shop/ProductActions";
import DuplicateCheck from "@/components/shop/DuplicateCheck";
import SizeGuide from "@/components/shop/SizeGuide";
import DressImageGallery from "@/components/shop/DressImageGallery";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Dress } from "@/lib/types";

async function getDressBySlug(slug: string): Promise<Dress | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("dresses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as Dress;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dress = await getDressBySlug(slug);

  if (!dress) {
    return { title: "Archived Collection | Top 10 Prom" };
  }

  return {
    title: `${dress.name} by ${dress.designer} | Top 10 Prom`,
    description: dress.description,
    openGraph: {
      title: dress.name,
      description: dress.description,
      images: [
        {
          url: `/api/og?dress=${dress.slug}`,
          width: 1200,
          height: 630,
          alt: dress.name,
        },
      ],
    },
    twitter: { card: "summary_large_image" as const },
  };
}

export default async function DressDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dress = await getDressBySlug(slug);

  if (!dress) notFound();

  return (
    <article className="min-h-screen bg-onyx pt-24 pb-32 selection:bg-gold selection:text-onyx">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Semantic Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex text-xs uppercase tracking-widest text-platinum mb-12"
        >
          <ol className="flex items-center space-x-3">
            <li>
              <a
                href="/"
                className="hover:text-gold transition-colors focus-visible:ring-1 focus-visible:ring-gold outline-none"
              >
                Home
              </a>
            </li>
            <li aria-hidden="true" className="opacity-50">
              /
            </li>
            <li>
              <a
                href="/dresses"
                className="hover:text-gold transition-colors focus-visible:ring-1 focus-visible:ring-gold outline-none"
              >
                Catalog
              </a>
            </li>
            <li aria-hidden="true" className="opacity-50">
              /
            </li>
            <li aria-current="page" className="text-ivory">
              {dress.name}
            </li>
          </ol>
        </nav>

        {/* 7/5 split: image-dominant layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Image Gallery (7 cols - dominant) */}
          <section
            aria-label="Product Images"
            className="lg:col-span-7 relative"
          >
            <Suspense
              fallback={<Skeleton className="aspect-[3/4] rounded-2xl" />}
            >
              <DressImageGallery
                images={dress.images}
                name={dress.name}
                designer={dress.designer}
              />
            </Suspense>
          </section>

          {/* Right Column: Details (5 cols) */}
          <section
            aria-label="Product Details"
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <header>
              <h2 className="text-gold text-sm font-bold tracking-[0.2em] uppercase mb-4">
                {dress.designer}
              </h2>
              <h1 className="text-4xl md:text-5xl font-light text-ivory mb-6 tracking-tight">
                {dress.name}
              </h1>
            </header>

            <p className="text-platinum leading-relaxed font-light text-lg mb-8 max-w-prose">
              {dress.description}
            </p>

            {/* Client Component Island: Isolated for Interactive State */}
            <Suspense
              fallback={<Skeleton className="min-h-[104px] rounded-3xl" />}
            >
              <ProductActions dress={dress} />
            </Suspense>

            {/* No-Duplicate-Dress Check */}
            <div className="mt-8">
              <DuplicateCheck dressId={dress.id} />
            </div>

            {/* Size Guide */}
            <div className="mt-6">
              <SizeGuide
                sizeChart={dress.size_chart}
                designer={dress.designer}
              />
            </div>

            {/* Book Appointment CTA (replaces VTO in Phase 1) */}
            <div className="mt-12 border-t border-white/10 pt-8">
              <a
                href="/book"
                className="block w-full py-5 rounded-full bg-gold text-onyx uppercase tracking-[0.2em] text-sm font-bold text-center hover:bg-ivory transition-colors"
              >
                See It In Person — Book an Appointment
              </a>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
