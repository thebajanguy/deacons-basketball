import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActiveUser, ProfileType } from '../../../identity-management/~common/models/active-user.type';
import { IdentityService } from '../../../identity-management/~common/services/identity.service';
import { ProfileService } from '../../../identity-management/~common/services/profile.service';


@Component({
  selector: 'app-user-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-summary.page.html',
  styleUrl: './user-summary.page.scss'
})
export class UserSummaryComponent {
  identityService = inject(IdentityService);
  profileService = inject(ProfileService);
  
  activeUser!: ActiveUser | null;

  profile: ProfileType | undefined;

  userProfile: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getActiveUser();
    this.getUserProfile() ;

    //this.getProfile(environment.apiConfig.protectedResources.graphApi.uri);
  }

  getActiveUser()
  {
    this.activeUser = this.identityService.GetActiveUser;
  }

  getProfile(url: string) {
    /*
    this.http.get(url).subscribe((profile) => {
      this.profile = profile;
    });
    */
  }

  getUserProfile() {
  /*
    this.profileService.getUserProfile().subscribe({
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

