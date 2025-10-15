// core/resolvers/seo.resolver.ts
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser';
import { CanonicalService } from '../services/canonical.service';
import { JsonLdService } from '../services/jsonld.service';

type SeoInput = {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  robots?: string;
  jsonLd?: Record<string, any>;
};

export function seoResolve(input: SeoInput): ResolveFn<boolean> {
  return (_: ActivatedRouteSnapshot) => {
    const titleSvc = inject(Title);
    const meta = inject(Meta);
    const canonical = inject(CanonicalService);
    const jsonld = inject(JsonLdService);

    meta.updateTag({ property: 'og:type', content: 'website' });
    meta.updateTag({ property: 'og:url', content: 'https://www.varsitysportsacademy.com/en/academics-and-sports/approach' });

  
    if (input.title) {
      titleSvc.setTitle(input.title);
      meta.updateTag({ property: 'og:title', content: input.title });
      meta.updateTag({ name: 'twitter:title', content: input.title });
    }
    if (input.description) {
      meta.updateTag({ name: 'description', content: input.description });
      // Optional: OpenGraph/Twitter (nice social previews)
      meta.updateTag({ property: 'og:description', content: input.description });
      meta.updateTag({ name: 'twitter:description', content: input.description });
    }
    if (input.keywords)
    {
      meta.updateTag({ name: 'keywords', content: input.keywords });
    }
    if (input.robots) {
      meta.updateTag({ name: 'robots', content: input.robots });
    } else {
      meta.updateTag({ name: 'robots', content: 'noindex,nofollow' });
    }
    if (input.canonical) canonical.setCanonical(input.canonical);
    if (input.jsonLd) jsonld.setJsonLd(input.jsonLd);

    return true;
  };
}
