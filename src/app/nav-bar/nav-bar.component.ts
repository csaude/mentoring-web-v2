
import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NavbarService } from './nav-bar.service';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})

/** 
* @author damasceno.lopes
*/
export class NavBarComponent implements OnInit {

  public user;ROLE_HIS;firstName;lastName;
  public showNavBar: boolean = false;
   
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public nav: NavbarService,
    public translate: TranslateService
  ) {

    translate.addLangs(['pt', 'en']);
    translate.setDefaultLang('pt');
    this.nav.invokeEvent.subscribe(value => {
      if (value === 'someVal') {
        this.callMyMethod();
      }
    });
  }

 /**
   * Call this method on start
   */
  callMyMethod() {
    
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.firstName=this.user.fullName.split(' ').slice(0, -1).join(' ');
    this.lastName=this.user.fullName.split(' ').slice(-1).join(' ');
    if (window.localStorage.getItem('mentoring_locale')) {
      this.translate.use(window.localStorage.getItem('mentoring_locale'));
    }

  }
  
  ngOnInit() {

    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    if (this.user) {
    var fullNameSplitted=this.user.fullName.split(' ');
    this.firstName=fullNameSplitted[0];
    this.lastName=fullNameSplitted[fullNameSplitted.length-1];
    this.showNavBar = true;
    if (window.localStorage.getItem('mentoring_locale')) {
      this.translate.use(window.localStorage.getItem('mentoring_locale'));
    }
    
    } else {
      this.router.navigate(['login']);
    }
    
  }

  ngOnDestroy() {
   
 }

  logout() {
    this.user=null;
    window.sessionStorage.clear();
    this.router.navigate(['login']);
  }

  setPt(){
    window.localStorage.removeItem('mentoring_locale')
    window.localStorage.setItem('mentoring_locale','pt')
    this.translate.use('pt');

  }
  
  setEn(){
    window.localStorage.removeItem('mentoring_locale')
    window.localStorage.setItem('mentoring_locale','en')
    this.translate.use('en');

  }


}