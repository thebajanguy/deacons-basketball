import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilitiesService } from '../../../../../core/services/utilities.service';


@Component({
  selector: 'app-identity-management-footer',
  standalone: true,
  imports : [CommonModule, RouterLink, RouterLinkActive, NgbModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class IdentityManagementFooterComponent implements OnInit {
  public date: Date = new Date();
  utilitiesService = inject(UtilitiesService);
  urlPath: string = ''; 
  loginPath: string = ''; 
  constructor( ) {
    this.urlPath = this.utilitiesService.UrlRoutePath; 
    this.loginPath = this.utilitiesService.LoginRoutePath;  
  }
  ngOnInit() {}
}
