import { Component, inject } from '@angular/core';
import {DatePipe} from '@angular/common';
import { UtilitiesService } from '../../../../../core/services/utilities.service';

@Component({
  selector: 'app-user-workspace-footer',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class UserWorkspaceFooterComponent {
  data: Date = new Date();
  test: Date = new Date();

  utilitiesService = inject(UtilitiesService);
  urlPath: string = ''; 
  loginPath: string = ''; 
  constructor( ) {
    this.urlPath = this.utilitiesService.UrlRoutePath; 
    this.loginPath = this.utilitiesService.LoginRoutePath;  
  }
}

