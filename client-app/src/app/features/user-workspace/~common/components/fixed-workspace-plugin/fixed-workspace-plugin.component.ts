import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-fixed-workspace-plugin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fixed-workspace-plugin.component.html',
  styleUrl: './fixed-workspace-plugin.component.scss'
})
export class FixedWorkspacePluginComponent implements OnInit {
  @Input() workspacePath: string = ''; 
  @Input() dashboardPage: boolean = false;

  constructor( ) {
  }
  ngOnInit(): void {
  }

}
