// core/services/route-seo.service.ts
import { inject, Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RouteSeoService {
  constructor() {
    const router = inject(Router);
    const title = inject(Title);
    const meta = inject(Meta);
    router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const route = this.findDeepest(inject(ActivatedRoute));
      const data = route?.snapshot.data || {};
      if (data['title']) title.setTitle(data['title']);
      if (data['description']) {
        meta.updateTag({ name: 'description', content: data['description'] });
        meta.updateTag({ property: 'og:description', content: data['description'] });
      }
    });
  }
  private findDeepest(ar: ActivatedRoute): ActivatedRoute {
    while (ar.firstChild) ar = ar.firstChild;
    return ar;
  }
}
