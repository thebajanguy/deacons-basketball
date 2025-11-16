// core/resolvers/seo.resolver.ts
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CanonicalService } from '../services/canonical.service';
import { JsonLdService } from '../services/jsonld.service';
import { DOCUMENT } from '@angular/common';


// seo.types.ts
export type JsonLd = Record<string, any> | Array<Record<string, any>>;

export interface SeoOpenGraph {
  title?: string;
  description?: string;
  url?: string;
  type?: 'website' | 'article' | string;
  image?: string | string[];
  locale?: string;          // e.g. 'en_BB'
  siteName?: string;        // e.g. 'Deacons Basketball Club'
}

export interface SeoTwitter {
  card?: 'summary' | 'summary_large_image' | string;
  title?: string;
  description?: string;
  image?: string;
  site?: string;            // @handle
}

export interface SeoInput {
  title?: string;
  description?: string;
  keywords?: string;
  robots?: string;          // default 'index,follow'
  canonical?: string;

  // NEW
  openGraph?: SeoOpenGraph;
  twitter?: SeoTwitter;
  jsonLd?: JsonLd;          // object or array of objects
}



export function seoResolve(input: SeoInput): ResolveFn<boolean> {
  return (_: ActivatedRouteSnapshot) => {
    const titleSvc = inject(Title);
    const meta = inject(Meta);
    const canonical = inject(CanonicalService);
    const jsonld = inject(JsonLdService);
    const doc = inject(DOCUMENT) as Document;

    // helpers
    const setMeta = (selector: { name?: string; property?: string }, content?: string) => {
      if (!content) return;
      meta.updateTag({ ...selector, content }, selector.name
        ? `name='${selector.name}'`
        : `property='${selector.property}'`);
    };

    const absoluteUrl = ((): string => {
      // prefer provided OG url or canonical; fallback to current location
      return (
        input?.openGraph?.url ||
        input?.canonical ||
        (doc?.location ? doc.location.href : '')
      );
    })();

    // ---------- Core tags ----------
    const robots = input.robots ?? 'index,follow';
    setMeta({ name: 'robots' }, robots);

    if (input.title) {
      titleSvc.setTitle(input.title);
      setMeta({ property: 'og:title' }, input.title);
      setMeta({ name: 'twitter:title' }, input.title);
    }

    if (input.description) {
      setMeta({ name: 'description' }, input.description);
      setMeta({ property: 'og:description' }, input.description);
      setMeta({ name: 'twitter:description' }, input.description);
    }

    if (input.keywords) setMeta({ name: 'keywords' }, input.keywords);

    // Canonical
    canonical.setCanonical(input.canonical ?? absoluteUrl);

    // ---------- Open Graph ----------
    setMeta({ property: 'og:type' }, input.openGraph?.type || 'website');
    setMeta({ property: 'og:url' }, absoluteUrl);
    if (input.openGraph?.title) setMeta({ property: 'og:title' }, input.openGraph.title);
    if (input.openGraph?.description) setMeta({ property: 'og:description' }, input.openGraph.description);
    if (input.openGraph?.siteName) setMeta({ property: 'og:site_name' }, input.openGraph.siteName);
    if (input.openGraph?.locale) setMeta({ property: 'og:locale' }, input.openGraph.locale);

    const ogImages = Array.isArray(input.openGraph?.image)
      ? input.openGraph?.image
      : (input.openGraph?.image ? [input.openGraph.image] : []);
    if (ogImages.length) {
      // First image as og:image (most crawlers use the first)
      setMeta({ property: 'og:image' }, ogImages[0]);
      // If you want to expose alternates, add indexed tags:
      ogImages.slice(1).forEach((img, i) =>
        setMeta({ property: `og:image:${i + 1}` }, img)
      );
    }

    // ---------- Twitter ----------
    setMeta({ name: 'twitter:card' }, input.twitter?.card || 'summary_large_image');
    if (input.twitter?.title) setMeta({ name: 'twitter:title' }, input.twitter.title);
    if (input.twitter?.description) setMeta({ name: 'twitter:description' }, input.twitter.description);
    if (input.twitter?.image) setMeta({ name: 'twitter:image' }, input.twitter.image);
    if (input.twitter?.site) setMeta({ name: 'twitter:site' }, input.twitter.site);

    // ---------- JSON-LD ----------
    if (input.jsonLd) {
      // Your service should handle clearing/replacing existing script tags.
      jsonld.setJsonLd(input.jsonLd);
    }

    return true;
  };
}

