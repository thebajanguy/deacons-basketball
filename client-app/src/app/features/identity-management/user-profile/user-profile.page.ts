import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { CommonModule } from '@angular/common';
import { GraphService } from '../~common/services/graph.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.page.html',
  styleUrl: './user-profile.page.scss'
})
export class UserProfilePage implements OnInit {
  userProfile: any;

  @Output() signInToParent = new EventEmitter<any>();
  @Output() signOutToParent = new EventEmitter();
  @Output() signUpToParent = new EventEmitter<any>();
  @Output() editProfileToParent = new EventEmitter();


    description = `
    <span class="title text-success">Propel my career.</span>&nbsp;
    <span class="title text-info">Propel my child.</span>&nbsp;
    <span class="title text-danger">Propel my team.</span>&nbsp;
  `.trim();  
    safeDescription: SafeHtml = '';

  constructor(private msalService: MsalService, private graphService: GraphService, private sanitizer: DomSanitizer,) {

    this.safeDescription = this.sanitizer.bypassSecurityTrustHtml(this.description);

  }

  ngOnInit(): void {
    /*
    this.msalService.instance.handleRedirectPromise().then((result) => {
      if (result && result.account) {
        this.msalService.instance.setActiveAccount(result.account);
        this.getUserProfile();
      }
    });
    */
  }

  login() {
    console.info('login');
    this.msalService.loginRedirect();
  }
  //
  getUserProfile() {
    console.info('getUserProfile');
    /*
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
    */
  }
}
