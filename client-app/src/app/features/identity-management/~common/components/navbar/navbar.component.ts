import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RedirectRequest, PopupRequest, PromptValue } from '@azure/msal-browser';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-identity-management-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgbModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class IdentityManagementNavbarComponent implements OnInit, OnDestroy {
    @Input() loginDisplay: boolean = false;
    @Input() urlPath: string = '';
    @Input() loginPath: string = '';

    @Output() signInToParent = new EventEmitter<any>();
    @Output() signOutToParent = new EventEmitter();
    @Output() signUpToParent = new EventEmitter<any>();
    @Output() editProfileToParent = new EventEmitter();

    constructor(protected router: Router) {    
    }

    ngOnInit(): void{
    }

    ngOnDestroy(): void {
    }

    //
    signOut(){
      this.signOutToParent.emit();
    }
    signIn() {
      let signUpSignInFlowRequest: RedirectRequest | PopupRequest  = {
        authority: environment.b2cPolicies.authorities.signUpSignIn.authority,
        scopes: [],
        prompt: PromptValue.LOGIN // force user to reauthenticate with their new password
      };

      alert('IdentityManagementNavbarComponent-signIn: ' + JSON.stringify(signUpSignInFlowRequest) );
      this.signInToParent.emit(signUpSignInFlowRequest);
    }
    signUp() {
      let signUpFlowRequest: RedirectRequest | PopupRequest  = {
        authority: environment.b2cPolicies.authorities.signUp.authority,
        scopes: [],
        prompt: PromptValue.LOGIN // force user to reauthenticate with their new password
      };
      this.signUpToParent.emit(signUpFlowRequest);
    }
    profileEdit() {
      this.editProfileToParent.emit();
    }
}