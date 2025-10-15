import { Component, inject, Renderer2 } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { CommonModule, ViewportScroller } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NgbModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    private meta = inject(Meta);
    private title = inject(Title);
    private vs = inject(ViewportScroller);

    currentYear = new Date().getFullYear();

    constructor(private renderer: Renderer2){
        this.title.setTitle('Varsity Sports Academy | Academic & Sports Preparation');
        this.meta.updateTag({name:'description', content:'Varsity Sports Academy Prep empowers student‑athletes with academic tutoring, elite training, and NCAA recruitment guidance to earn scholarships.'});
        this.meta.updateTag({property:'og:title', content:'Varsity Sports Academy | Academic & Sports Preparation'});
        this.meta.updateTag({property:'og:type', content:'website'});
    }


    ngOnInit() {
      // Apply a global anchor offset (e.g., for sticky header height)
      this.vs.setOffset([0, 80]); // [x, y]
    }

    ngAfterViewInit() {
       // const nav = document.querySelector('.navbar.fixed-top') as HTMLElement | null;
        //const setH = () => this.renderer.setStyle(document.documentElement, '--nav-h', (nav?.offsetHeight ?? 72) + 'px');
        //setH();
        //window.addEventListener('resize', setH);
    }

}