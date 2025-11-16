import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-fixed-join-now-plugin-cmp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fixed-join-now-plugin.component.html',
  styleUrl: './fixed-join-now-plugin.component.scss'
})
export class FixedJoinNowPluginComponent implements OnInit {
  @Input() urlPath: string = ''; 
  @Input() membershipPath: string = ''; 
  @Input() workspacePath: string = ''; 
  @Input() shouldDisplayMembershipPage: boolean = false;
  @Input() shouldDisplayLogin: boolean = false;
  @Input() shouldDisplayJoinNow: boolean = true;

  //

  constructor( ) {
  }
  ngOnInit(): void {
  }

}
