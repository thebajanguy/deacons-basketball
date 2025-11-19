import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilitiesService } from '../../../../../../core/services/utilities.service';

@Component({
  selector: 'app-footer-cmp',
  standalone: true,
  imports: [CommonModule, RouterLink, NgbModule], // ⬅️ add RouterLinkActive


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

  // Toggle which player profiles are live (clickable) on the site.
  // false = greyed out & unclickable; true = active, clickable with hover effect.
  point_guards: Record<string, boolean> = {
    // Point Guards
    IkorosBrathwaite: false,
    KemaniMaynard: false,
    DanielToppin: false,
    JordanBlackman: false,
    JeromeArthur: false,
    MicahDuke: false,
    DarioRice: false,
    MikkelWiltshire: false,
    NoahBlai: false,
    RohanBishop: false,
  };
  shooting_guards: Record<string, boolean> = {
    // Shooting Guards
    IsaacGriffith: false,
    AriMottleySquires: false,
    ImmanuelBlai: false,
    TajCoxMayers: false,
    AliMohammad: false,
    JoshuaMaxwell: false,
  };
  forwards: Record<string, boolean> = {
    // Forwards
    AhrenFrancis: false,
    XavierBoyce: false,
    AidanOMeally: false,
    TevezBryanCadogan: false,
    KirkPatrickForde: false,

  };
  centers: Record<string, boolean> = {
    // Centers
    RhysCozier: false,
    KristopherRogers: false,
    XavierFrancis: false,
    LanceSimmons: false
  };
  
  // Optional helpers to publish/unpublish profiles
  /*
  publishProfile(name: keyof typeof this.profiles)  { this.profiles[name] = true; }
  unpublishProfile(name: keyof typeof this.profiles){ this.profiles[name] = false; }
  publishMany(names: Array<keyof typeof this.profiles>) { names.forEach(n => this.profiles[n] = true);}
  unpublishMany(names: Array<keyof typeof this.profiles>) { names.forEach(n => this.profiles[n] = false); }  
  */
}
