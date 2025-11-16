import { Component, OnInit, ElementRef, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTES } from '../sidebar/sidebar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-workspace-navbar',
  standalone: true,
  imports: [NgbModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class UserWorkspaceNavbarComponent implements OnInit, OnDestroy {
  public isCollapsed = false;
  private listTitles: any[] = [];
  private sidebarVisible: boolean = false;
  private mobile_menu_visible: any = 0;
  private toggleButton: any;



    //utilitiesService = inject(UtilitiesService);
    @Input() loginDisplay: boolean = false;
    @Input() urlPath: string = '';
    @Input() loginPath: string = '';
    @Input() workspacePath: string = '';
  
    @Output() signOutToParent = new EventEmitter();
    @Output() editProfileToParent = new EventEmitter();
  
    constructor(protected router: Router, protected location: Location,  protected element: ElementRef
    ) {
      this.sidebarVisible = false;
    }


  ngOnInit(): void{
    //super.OnInit();

    this.listTitles = ROUTES.filter((listTitle: any) => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    this.router.events.subscribe((event: any) => {
      this.sidebarClose();
       var $layer: any = document.getElementById('bodyClick');
       if ($layer) {
         $layer.remove();
         this.mobile_menu_visible = 0;
       }
   });

  }

  ngOnDestroy(): void {
    //super.OnDestroy();
  }

  //
  signOut(){
    this.signOutToParent.emit();
  }
  profileEdit() {
    this.editProfileToParent.emit();
  }

  //
  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }
      for (let i = 0; i < this.listTitles.length; i++) {
          if (this.listTitles[i].type === "link" && this.listTitles[i].path === titlee) {
              return this.listTitles[i].title;
          } else if (this.listTitles[i].type === "sub") {
              for (let j = 0; j < this.listTitles[i].children.length; j++) {
                  let subtitle = this.listTitles[i].path + '/' + this.listTitles[i].children[j].path;
                  // console.log(subtitle)
                  // console.log(titlee)
                  if (subtitle === titlee) {
                      return this.listTitles[i].children[j].title;
                  }
              }
          }
      }
      return titlee;
  }
  collapse(){
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName('nav')[0];
    if (this.isCollapsed) {
      navbar.classList.remove('navbar-transparent');
      navbar.classList.add('bg-white');
    }else{
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('bg-white');
    }

  }
  sidebarOpen() {
      const toggleButton = this.toggleButton;
      const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
      const html = document.getElementsByTagName('html')[0];

      setTimeout(function(){
          toggleButton.classList.add('toggled');
      }, 500);

      html.classList.add('nav-open');

      this.sidebarVisible = true;
  };
  sidebarClose() {
      const html = document.getElementsByTagName('html')[0];
      this.toggleButton.classList.remove('toggled');
      const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];

      this.sidebarVisible = false;
      html.classList.remove('nav-open');
  };
  sidebarToggle() {
      // const toggleButton = this.toggleButton;
      // const html = document.getElementsByTagName('html')[0];
      var $toggle = document.getElementsByClassName('navbar-toggler')[0];

      if (this.sidebarVisible === false) {
          this.sidebarOpen();
      } else {
          this.sidebarClose();
      }
      const html = document.getElementsByTagName('html')[0];

      if (this.mobile_menu_visible == 1) {
          // $('html').removeClass('nav-open');
          html.classList.remove('nav-open');
          var $layer = document.createElement('div');

          if ($layer) {
              $layer.remove();
          }
          setTimeout(function() {
              $toggle.classList.remove('toggled');
          }, 400);

          this.mobile_menu_visible = 0;
      } else {
          setTimeout(function() {
              $toggle.classList.add('toggled');
          }, 430);

          var $layer = document.createElement('div');
          $layer.setAttribute('id', 'bodyClick');


          if (html.getElementsByTagName('body')) {
              document.getElementsByTagName('body')[0].appendChild($layer);
          }

          $layer.onclick = () => { //asign a function
            html.classList.remove('nav-open');
            this.mobile_menu_visible = 0;
            setTimeout(function() {
                $layer.remove();
                $toggle.classList.remove('toggled');
            }, 400);
            const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];

            if (window.innerWidth < 991) {
              setTimeout(function(){
                mainPanel.style.position = '';
              }, 500);
            }
          };//.bind(this);

          html.classList.add('nav-open');
          this.mobile_menu_visible = 1;
      }
  };
}
