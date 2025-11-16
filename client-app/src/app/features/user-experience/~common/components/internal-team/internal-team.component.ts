import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UtilitiesService } from '../../../../../core/services/utilities.service';

@Component({
  selector: 'app-management-team-cmp',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './internal-team.component.html',
  styleUrl: './internal-team.component.scss'
})
export class InternalTeamComponent {
  utilitiesService = inject(UtilitiesService);
  urlPath: string = ''; 
  loginPath: string = ''; 
  constructor( ) {
    this.urlPath = this.utilitiesService.UrlRoutePath; 
    this.loginPath = this.utilitiesService.LoginRoutePath;  
  }

}
