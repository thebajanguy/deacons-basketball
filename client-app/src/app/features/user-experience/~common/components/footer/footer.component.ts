import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilitiesService } from '../../../../../core/services/utilities.service';
import { SocialPluginComponent } from "../social-plugin/social-plugin.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, NgbModule, SocialPluginComponent], // ⬅️ add RouterLinkActive


  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  public date: Date = new Date();
  utilitiesService = inject(UtilitiesService);
  urlPath: string = ''; 
  loginPath: string = ''; 
  constructor( ) {
    this.urlPath = this.utilitiesService.UrlRoutePath; 
    this.loginPath = this.utilitiesService.LoginRoutePath;  
  }
  get lang() { return this.route.snapshot.paramMap.get('lang') || 'en'; }


  ngOnInit() {}
}
