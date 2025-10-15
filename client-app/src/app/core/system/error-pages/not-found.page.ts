import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
standalone: true,
imports: [RouterLink],
template: `
<section class="container mx-auto p-6">
<h1 class="text-3xl font-bold">404 — Page Not Found</h1>
<a routerLink="/" class="underline">Go home</a>
</section>
`
})
export class NotFoundPage {}