import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-champions-ribbon-cmp',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './champions-ribbon.component.html',
  styleUrl: './champions-ribbon.component.scss'
})
export class EmbeddedVideoComponent {

  @Input() embeddedVideoId: string | null = '';
  sanitizer: any;
  constructor(sanitizer: DomSanitizer) {
    this.sanitizer = sanitizer;

  }

  videoURL(): string {
    //let videoUri = `https://www.youtube.com/embed/${this.embeddedVideoId}?autoplay=1&loop=1&playlist=${this.embeddedVideoId}`;
    let videoUri = 'https://www.youtube.com/embed/ju0y2iqXxR0?autoplay=1&loop=1&playlist=ju0y2iqXxR0';

    return this.sanitizer.bypassSecurityTrustUrl(videoUri);
  }

}
