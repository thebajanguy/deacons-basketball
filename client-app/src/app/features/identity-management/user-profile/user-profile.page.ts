import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { CommonModule } from '@angular/common';
import { GraphService } from '../~common/services/graph.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.page.html',
  styleUrl: './user-profile.page.scss'
})
export class UserProfilePage implements OnInit {
  userProfile: any;

  constructor(private msalService: MsalService, private graphService: GraphService) {
  }

  ngOnInit(): void {

    this.msalService.instance.handleRedirectPromise().then((result) => {
      if (result && result.account) {
        this.msalService.instance.setActiveAccount(result.account);
        this.getUserProfile();
      }
    });
  }

  login() {
    this.msalService.loginRedirect();
  }

  getUserProfile() {
    this.graphService.getUserProfile().subscribe({
      next: data => {
        this.userProfile = data;
        alert(JSON.stringify(this.userProfile));
      },
      error: err => {
        console.error('Error occurred: ' + err);
        alert('Error occurred: ' + err);
      }
    });
  }
}
