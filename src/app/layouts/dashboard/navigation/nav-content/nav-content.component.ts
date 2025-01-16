import {Component, EventEmitter, inject, NgZone, OnInit, Output} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {AsyncPipe, DOCUMENT, Location, NgClass, NgFor, NgIf, UpperCasePipe} from '@angular/common';
import {NavigationItem} from '../navigation';
import {Observable, of} from "rxjs";
import {NavCollapseComponent} from "./nav-collapse/nav-collapse.component";
import {NavItemComponent} from "./nav-item/nav-item.component";
import {IProfile} from "../../interfaces/profile.interface";
import {layoutConfig} from "../../layout.config";

@Component({
    selector: 'app-nav-content',
    imports: [
        RouterModule,
        NgClass,
        UpperCasePipe,
        NgFor,
        NgIf,
        AsyncPipe,
        // forwardRef(() => NavGroupComponent),
        // forwardRef(() => NavCollapseComponent),
        // forwardRef(() => NavItemComponent),
        // NavGroupComponent,
        NavCollapseComponent,
        NavItemComponent,
    ],
    templateUrl: './nav-content.component.html',
    styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {
  public nextConfig: any;
  navigation$ = this.nav.getMenu$;

  // public navigation: any;
  public prevDisabled: string;
  public nextDisabled: string;
  public contentWidth: number;
  public wrapperWidth: any;
  public scrollWidth: any;
  public windowWidth: number;
  public isNavProfile: boolean;

  @Output() onNavMobCollapse = new EventEmitter();

  // @ViewChild('navbarContent', {static: false}) navbarContent: ElementRef | undefined;
  // @ViewChild('navbarWrapper', {static: false}) navbarWrapper: ElementRef | undefined;

  userProfile$: Observable<IProfile> = of({
    Cargo: '',
    Email: '',
    AbrNombres: '',
    Nombres: ''
  }) //this.profileService.profile$;

  document = inject(DOCUMENT);

  constructor(public nav: NavigationItem,
              private route: Router,
              private zone: NgZone,
              private location: Location) {
    this.nextConfig = layoutConfig;
    this.windowWidth = window.innerWidth;
    this.prevDisabled = 'disabled';
    this.nextDisabled = '';
    this.scrollWidth = 0;
    this.contentWidth = 0;

    this.isNavProfile = false;
  }

  ngOnInit() {
    if (this.windowWidth < 992) {
      this.nextConfig['layout'] = 'vertical';
      setTimeout(() => {
        this.document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
      }, 500);
    }
  }

  logout() {
    /*showSwalConfirm({
      title: 'Cerrar Sesión',
      text: 'Esta seguro de cerrar su sesión?',
      confirmButtonText: 'Si, cerrar sesión'
    }).then(result => {
      if (!result) {
        return;
      }

      this.loginService.logOut();
      this.route.navigate(['./auth/login']);
    });*/
  }

  /*fireLeave() {
    const sections = document.querySelectorAll('.pcoded-hasmenu');
    for (let i = 0; i < sections.length; i++) {
      sections[i].classList.remove('active');
      sections[i].classList.remove('pcoded-trigger');
    }

    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = 'a.nav-link[ href=\'' + current_url + '\' ]';
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('active');
      } else if (up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('active');
      }
    }
  }*/

  navMob() {
    if (this.windowWidth < 992 && this.document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
      this.onNavMobCollapse.emit();
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    const {_baseHref} = this.location as any;
    if (_baseHref) {
      current_url = _baseHref + this.location.path();
    }
    const link = 'a.nav-link[ href=\'' + current_url + '\' ]';
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('pcoded-hasmenu')) {
        if (this.nextConfig['layout'] === 'vertical') {
          parent.classList.add('pcoded-trigger');
        }
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('pcoded-hasmenu')) {
        if (this.nextConfig['layout'] === 'vertical') {
          up_parent?.classList.add('pcoded-trigger');
        }
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
        if (this.nextConfig['layout'] === 'vertical') {
          last_parent.classList.add('pcoded-trigger');
        }
        last_parent.classList.add('active');
      }
    }
  }

}
