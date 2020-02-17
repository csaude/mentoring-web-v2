import { Injectable } from '@angular/core';
import {HttpClient,HttpParams} from '@angular/common/http';
import * as myGlobals from '../../../globals';
import { Subject } from 'rxjs';


/**
 * @author damasceno.lopes
 */
@Injectable()
export class ReportsService {

  
  public url: string = myGlobals.API;
  invokeEvent: Subject<any> = new Subject();

  constructor(private httpClient: HttpClient) {
  }

  callMethodUpdateOfComponent() {
    this.invokeEvent.next('someVal');
  }

  callMethodReloadOfComponent() {
    this.invokeEvent.next('someValReload');
  }

  findSampleReports(from,until) {
   const params = new HttpParams()
   .set('endDate', until)
   .set('startDate', from);
  return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/indicators/sample-indicators', {params});
  }

  findAnalysisTables(from,until) {
    const params = new HttpParams()
    .set('endDate', until)
    .set('startDate', from);
   return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/indicators/analysis-tables', {params});
   }

   findMentoringSessions(from,until) {
    const params = new HttpParams()
    .set('endDate', until)
    .set('startDate', from);
   return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/mentorships/performed-sessions', {params});
   }

   findMentoringSessionsList(from,until) {
    const params = new HttpParams()
    .set('endDate', until)
    .set('startDate', from);
   return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/mentorships/performed-sessions-list', {params});
   }

   findMentoringSessionsHTS(from,until) {
    const params = new HttpParams()
    .set('endDate', until)
    .set('startDate', from);
   return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/mentorships/performed-sessions-hts', {params});

   }

   findMentoringSessionsNarrative(from,until) {
    const params = new HttpParams()
    .set('endDate', until)
    .set('startDate', from);
   return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/mentorships/performed-sessions-narrative', {params});

   }

   findMentoringSessionsIndicators(from,until) {
    const params = new HttpParams()
    .set('endDate', until)
    .set('startDate', from);
   return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/mentorships/performed-sessions-indicators', {params});

   }

   findMentoringSessionsIndicatorsList(from,until) {
    const params = new HttpParams()
    .set('endDate', until)
    .set('startDate', from);
   return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/mentorships/performed-sessions-indicators-list', {params});

   }


}