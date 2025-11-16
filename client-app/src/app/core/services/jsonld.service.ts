// core/services/jsonld.service.ts
import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class JsonLdService {
  private doc = inject(DOCUMENT);

  setJsonLd(data: Record<string, any>) {
    // Remove any existing JSON-LD to avoid duplicates on client nav
    this.doc.querySelectorAll('script[type="application/ld+json"]').forEach(s => s.remove());
    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.doc.head.appendChild(script);
  }
}
