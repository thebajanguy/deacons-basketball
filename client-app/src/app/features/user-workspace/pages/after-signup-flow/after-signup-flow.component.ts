import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ProfileService } from '../../../-identity-management/services/profile.service';

type ActiveUser = {
  givenName?: string;
  surname?: string;
  displayName?: string;
  userPrincipalName?: string;
  id?: string;
}

@Component({
  selector: 'app-after-signup-flow',
  standalone: true,
  imports: [],
  templateUrl: './after-signup-flow.component.html',
  styleUrl: './after-signup-flow.component.scss'
})
export class AfterSignupFlowComponent {

  activeUser: ActiveUser | undefined;

  constructor(private http: HttpClient, private profileService: ProfileService) {}

  ngOnInit() {
    this.getProfile(environment.apiConfig.protectedResources.graphApi.uri);
  }

  getProfile(url: string) {
    /*
    this.profileService.getProfile().subscribe((profile) => {
      this.profile = profile;
    });
    */
   let active
    console.log(`URL: ${url}`);
    this.http.get(url).subscribe((profile) => {
      this.activeUser = profile;
    });
  }

}
