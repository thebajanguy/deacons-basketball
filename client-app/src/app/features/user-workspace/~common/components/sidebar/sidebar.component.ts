import { Component, OnInit, inject } from '@angular/core';
import { CoreNotificationsService } from '../../../../-core/notifications/notifications.service';
import { ActiveUserType } from '../../../../-identity-management/models/active-user.type';
import { IdentityService } from '../../../../-identity-management/services/identity.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

var misc:any ={
  sidebar_mini_active: true
}

export interface RouteInfo {
path: string;
title: string;
type: string;
icontype: string;
collapse?: string;
isCollapsed?: boolean;
isCollapsing?: any;
children?: ChildrenItems[];
}

export interface ChildrenItems {
path: string;
title: string;
ab: string;
type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [
{
  path: "/en/user-workspace/dashboard",
  title: "Dashboard",
  type: "link",
  icontype: "nc-chart-pie-36"
},
{
  path: "/en/user-workspace",
  title: "Varsity Sports Academy",
  type: "sub",
  icontype: "nc-app",
  collapse: "user-workspace",
  isCollapsed: true,
  children: [
    { path: "account", title: "Account Page", ab: "APP" }
  ]
},
{
  path: "/pages",
  title: "Pages",
  type: "sub",
  icontype: "nc-single-copy-04",
  collapse: "pages",
  isCollapsed: true,
  children: [
    { path: "pricing", title: "Pricing Page", ab: "PP" },
    { path: "timeline", title: "Timeline Page", ab: "TP" },
    { path: "login", title: "Login Page", ab: "LP" },
    { path: "register", title: "Register Page", ab: "RP" },
    { path: "lock", title: "Lock Screen Page", ab: "LSP" },
    { path: "user", title: "User Page", ab: "UP" }
  ]
},
{
  path: "/components",
  title: "Components",
  type: "sub",
  icontype: "nc-support-17",
  collapse: "components",
  isCollapsed: true,
  children: [
    { path: "buttons", title: "Buttons", ab: "B" },
    { path: "grid", title: "Grid System", ab: "GS" },
    { path: "panels", title: "Panels", ab: "P" },
    { path: "sweet-alert", title: "Sweet Alert", ab: "SA" },
    { path: "notifications", title: "Notifications", ab: "N" },
    { path: "icons", title: "Icons", ab: "I" },
    { path: "typography", title: "Typography", ab: "T" }
  ]
},
{
  path: "/forms",
  title: "Forms",
  type: "sub",
  icontype: "nc-ruler-pencil",
  collapse: "forms",
  isCollapsed: true,
  children: [
    { path: "regular", title: "Regular Forms", ab: "RF" },
    { path: "extended", title: "Extended Forms", ab: "EF" },
    { path: "validation", title: "Validation Forms", ab: "VF" },
    { path: "wizard", title: "Wizard", ab: "W" }
  ]
},
{
  path: "/tables",
  title: "Tables",
  type: "sub",
  icontype: "nc-bullet-list-67",
  collapse: "tables",
  isCollapsed: true,
  children: [
    { path: "regular", title: "Regular Tables", ab: "RT" },
    { path: "extended", title: "Extended Tables", ab: "ET" },
    { path: "ngx-datatable", title: "Ngx Datatable", ab: "ND" }
  ]
},
{
  path: "/maps",
  title: "Maps",
  type: "sub",
  icontype: "nc-pin-3",
  collapse: "maps",
  isCollapsed: true,
  children: [
    { path: "google", title: "Google Maps", ab: "GM" },
    { path: "fullscreen", title: "Full Screen Map", ab: "FSM" },
    { path: "vector", title: "Vector Map", ab: "VM" }
  ]
},
{
  path: "/widgets",
  title: "Widgets",
  type: "link",
  icontype: "nc-atom"
},
{
  path: "/charts",
  title: "Charts",
  type: "link",
  icontype: "nc-chart-bar-32"
},
{
  path: `/calendar`,
  title: "Calendar",
  type: "link",
  icontype: "nc-time-alarm"
}
];

@Component({
  selector: 'app-user-workspace-sidebar',
  standalone: true,
  imports: [CommonModule, NgbModule, RouterLink],
  templateUrl: './user-workspace-sidebar.component.html',
  styleUrl: './user-workspace-sidebar.component.scss'
})
export class UserWorkspaceSidebarComponent implements OnInit {
  identityService = inject(IdentityService);
  protected activeUser!: ActiveUserType | null;

  public menuItems: any[] = [];
  public isCollapsed = true;
  public isAccountPage = false;

  constructor(private toastr: CoreNotificationsService) {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.openSidebarByDefault();
    this.activeUser = this.identityService.GetActiveUser;
    this.isAccountPage = window.location.pathname.includes('account');

    this.activeUser =  {
      givenName: 'Joe',
      surname: 'Brown'
    };
 }
  openSidebarByDefault() {
    // Open the Sidebar Menu By Default
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('sidebar-mini');
    misc.sidebar_mini_active = false;
  }
  sleep(milliseconds: any) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if (new Date().getTime() - start > milliseconds) {
        break;
      }
    }
  }
  myFunc(event: any, menuitem: any) {
    event.preventDefault();
    event.stopPropagation();
    this.sleep(10);
    if (menuitem.isCollapsing === undefined) {
      menuitem.isCollapsing = true;

      // menuitem.isCollapsed = !menuitem.isCollapsed;

      var element = event.target;
      while (
        element.getAttribute("data-toggle") != "collapse" &&
        element != document.getElementsByTagName("html")[0]
      ) {
        element = element.parentNode;
      }
      element = element.parentNode.children[1];

      if (
        element.classList.contains("collapse") &&
        !element.classList.contains("show")
      ) {
        element.classList = "before-collapsing";
        var style = element.scrollHeight;

        element.classList = "collapsing";
        setTimeout(function() {
          element.setAttribute("style", "height:" + style + "px");
        }, 1);
        setTimeout(function() {
          element.classList = "collapse show";
          element.removeAttribute("style");
          menuitem.isCollapsing = undefined;
        }, 350);
      } else {
        var style = element.scrollHeight;
        setTimeout(function() {
          element.setAttribute("style", "height:" + (style + 20) + "px");
        }, 3);
        setTimeout(function() {
          element.classList = "collapsing";
        }, 3);
        setTimeout(function() {
          element.removeAttribute("style");
        }, 20);
        setTimeout(function() {
          element.classList = "collapse";
          menuitem.isCollapsing = undefined;
        }, 400);
      }
    }
  }
  minimizeSidebar(){
    const body = document.getElementsByTagName('body')[0];

    if (body.classList.contains('sidebar-mini')) {
        misc.sidebar_mini_active = true
    } else {
      misc.sidebar_mini_active = false;
    }

    if (misc.sidebar_mini_active === true) {
        body.classList.remove('sidebar-mini');
        misc.sidebar_mini_active = false;
        this.showSidebarMessage('Sidebar mini deactivated...');
    } else {
            body.classList.add('sidebar-mini');
            this.showSidebarMessage('Sidebar mini activated...');
            misc.sidebar_mini_active = true;
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function() {
        window.dispatchEvent(new Event('resize'));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function() {
        clearInterval(simulateWindowResize);
    }, 1000);
  }

  showSidebarMessage(message: any){
    this.toastr.showInfo(
      '<span class="custom-ui-icons ui-1_bell-53"></span>', message,
      {
        timeOut: 4000,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-danger alert-with-icon",
        positionClass: "toast-top-right"
      }
    );
  }
}

