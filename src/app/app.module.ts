import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/*Mentoring Modules*/
import { LoginsModule } from "./login/logins.module";
import { HomesModule } from "./home/home.module";
import { NavBarModule } from "./nav-bar/nav-bar.module";
import { NotFoundComponent } from './not-found/not-found.component';
import { QuestionsModule } from "./questions/questions.module";
import { ProgrammaticAreasModule } from "./programmaticareas/programmaticareas.module";
import { TutoredsModule } from "./tutoreds/tutoreds.module";
import { TutorsModule } from "./tutors/tutors.module";
import { FormssModule } from "./forms/forms.module";
import { ReportsModule } from "./reports/reports.module";

/*routing*/
import { routing } from './app.routing';
import { loginsRouting } from "./login/logins.routing";
import { homesRouting } from "./home/home.routing";
import { questionsRouting } from "./questions/questions.routing";
import { programmaticareasRouting } from "./programmaticareas/programmaticareas.routing";
import { tutoredsRouting } from "./tutoreds/tutoreds.routing";
import { tutorsRouting } from "./tutors/tutors.routing";
import { formsRouting } from "./forms/forms.routing";
import { reportsRouting } from "./reports/reports.routing";

/** Services*/
import { NavbarService } from "././nav-bar/nav-bar.service";
import { ResourcesModule } from "./resources/resources.module";
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from "ng2-translate";

/** Fix 404 error on page refresh */
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ProgrammaticAreasModule,
    QuestionsModule,
    TutoredsModule, 
    questionsRouting,
    homesRouting,
    loginsRouting,
    programmaticareasRouting,
    tutoredsRouting,
    tutorsRouting,
    formsRouting,
    reportsRouting,
    routing,
    

    HttpClientModule,
    ResourcesModule,
    HomesModule,
    LoginsModule,
    NavBarModule,
    TutorsModule,
    FormssModule,
    ReportsModule,

    TranslateModule.forRoot()

  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },NavbarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
