import { Component } from '@angular/core';


@Component({
standalone: true,
template: `
<section class="container mx-auto p-6">
<h1 class="text-3xl font-bold">Something went wrong</h1>
<p>Please try again later.</p>
</section>
`
})
export class ErrorPage {}