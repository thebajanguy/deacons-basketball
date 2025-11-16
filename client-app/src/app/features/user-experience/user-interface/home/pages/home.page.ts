import { Component, ViewEncapsulation, Input, ChangeDetectionStrategy, Inject, Renderer2, RendererFactory2, OnChanges, inject } from '@angular/core';
import { CommonModule, NgIf, NgFor, DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

import { NewsletterComponent } from '../../correspondence/components/newsletter.component';
import { BasePageComponent } from '../../../../../core/directives/base-page.directive';
import { BaseHeroComponent } from "../../../~common/components/base-hero/base-hero.component";
import { TimerModalComponent } from "../../../~common/components/timer-modal/timer-modal.component";
import { SignupStepsComponent } from "../../../~common/components/signup-steps/signup-steps.component";


@Component({
    selector: 'app-home-page',
    standalone: true,

    imports: [CommonModule, RouterLink, NewsletterComponent, NgbModule, BaseHeroComponent, TimerModalComponent, SignupStepsComponent],
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
  
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage extends BasePageComponent {
    override pageName = 'vsa-page';
    description = `
    Join Deacons Basketball Club — Barbados’ Premier Youth Development Program.
    Where passion meets purpose, we empower young ballers to excel on the court through discipline, teamwork, and opportunity.
    🏀 “Many Teams — One Family.”
    💪 Getting Better Every Day.        `.trim();
       
    year = new Date().getFullYear();

    // Example data – swap for API calls later
    nextPractices = [
      { date: 'Mon-Fri', time: '5:30 PM', venue: 'Deacons' },
      { date: 'Sat', time: '5:00 PM', venue: 'Deacons' },
      { date: 'Sun', time: '4:00 PM', venue: 'Deacons' },
    ];
  
    programs = [
      { title: 'Rookie Academy — Boys & Girls 11 & Under', 
        blurb: `
        Build confidence early with our fun-first basketball program for young basketballers.
        Through exciting games that develop movement, balance, coordination, and teamwork, players learn to love the game while building a strong foundation for future success.`, img: 'assets/img/sections/deacons-mini-ball-332-226.png' },
        


        { title: 'Junior Academy — Boys & Girls 12–15', 
        blurb: `Advance your game with focused training in footwork, shooting form, and team play.
        Our Junior Academy helps young basketballers refine their fundamentals, improve basketball IQ, and build confidence through structured, competitive sessions.`, 
        img: 'assets/img/sections/deacons-junior-academy-332-226.jpg' },
  
      { title: "Elite Academy — Boys & Girls 16–19", 
        blurb: `Become next level with our Elite Academy program.
        Designed for advanced players, this academy focuses on skill refinement, strength & conditioning, and basketball IQ to prepare basketballers for competition, scholarships, & higher-level opportunities.`, 
        img: 'assets/img/sections/deacons-u16-elite-332-226.jpg' },
      
       /* { 
          title: 'Girls Academy — All Ages & Skill Levels', 
          blurb: `Empowering girls of every age to learn, play, and grow through basketball.
          The Girls Academy welcomes beginners to advanced players, focusing on confidence, teamwork, and skill development in a supportive, fun environment designed to help every athlete reach her potential.`, 
          img: 'assets/img/sections/deacons-mini-ball-332-226.png'
        },*/
    ];
  
    teams = [
      { name: '2024 BABA SUMMER JAM CHAMPIONS ', level: 'U14 CHAMPIONS', img: 'assets/img/sections/deacons_u14_champions.jpg' },
      { name: '2025  BABA SUMMER JAM CHAMPIONS', level: 'U16 CHAMPIONS', img: 'assets/img/heroes/deacons-basketball-home-hero.jpg' },
    ];
  
    sponsors = [
      { name: 'Sandy Lane Charitable Trust', logo: 'assets/img/logos/external/all-eletes.png' },
      { name: 'Export Barbados', logo: 'assets/img/logos/external/zeurtek.png' },
      { name: 'ZeurTek', logo: 'assets/img/logos/internal/logo.png' }
    ];

    
    constructor( 
        @Inject(DOCUMENT) doc: Document, rf: RendererFactory2) {
        super(doc, rf);
        /*
        alert(doc.location.href);       
        alert(doc.location.origin);    
        alert(doc.location.hostname);    
        alert(doc.location.pathname);    
        */  
    } 

    // In your component
  navOpen = false;

  // Optional search open hook if you have a modal service
  openSearch(): void {
    // Replace this with your actual modal or router logic
    console.log('Search modal would open here');
  }



}


