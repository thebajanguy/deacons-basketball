import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UtilitiesService } from '../../../../../core/services/utilities.service';

@Component({
  selector: 'app-management-team',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './management-team.component.html',
  styleUrl: './management-team.component.scss'
})
export class ManagementTeamComponent {
  utilitiesService = inject(UtilitiesService);
  urlPath: string = ''; 
  loginPath: string = ''; 
  constructor( ) {
    this.urlPath = this.utilitiesService.UrlRoutePath; 
    this.loginPath = this.utilitiesService.LoginRoutePath;  
  }

}
