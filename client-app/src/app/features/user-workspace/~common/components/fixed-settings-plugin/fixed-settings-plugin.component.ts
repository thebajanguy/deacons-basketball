import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fixed-settings-plugin',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './fixed-settings-plugin.component.html',
  styleUrl: './fixed-settings-plugin.component.scss'
})
export class FixedSettingsPluginComponent implements OnInit {

  public sidebarColor: string = "red";
  public state: boolean = true;

  constructor(config: NgbDropdownConfig, public toastr: ToastrService) {
    // customize default values of dropdowns used by this component tree
    config.placement = 'bottom-left';
    config.autoClose = false;
  }

  changeSidebarColor(color: string){
    var sidebar = <HTMLElement>document.querySelector('.sidebar');

    this.sidebarColor = color;
    if(sidebar != undefined){
        sidebar.setAttribute('data-color',color);
    }
  }
  showSidebarMessage(message: string | undefined){
    this.toastr.show(
      '<span class="now-ui-icons ui-1_bell-53"></span>', message,
      {
        timeOut: 4000,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-danger alert-with-icon",
        positionClass: "toast-top-right"
      }
    );
  }
  onChange(event: any){
    const body = document.getElementsByTagName('body')[0];
      if (this.state === true) {
        body.classList.remove('sidebar-mini');
        this.showSidebarMessage('Sidebar mini deactivated...');
      } else {
        body.classList.add('sidebar-mini');
        this.showSidebarMessage('Sidebar mini activated...');
      }
      // we simulate the window Resize so the charts will get updated in realtime.
      var simulateWindowResize = setInterval(function(){
          window.dispatchEvent(new Event('resize'));
      },180);

      // we stop the simulation of Window Resize after the animations are completed
      setTimeout(function(){
          clearInterval(simulateWindowResize);
      },1000);
    }

  ngOnInit() {
  }

}
