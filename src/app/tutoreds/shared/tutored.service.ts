import { Injectable } from '@angular/core';
import {HttpClient,HttpParams} from '@angular/common/http';
import * as myGlobals from '../../../globals';
import { Subject } from 'rxjs';


/**
 * @author damasceno.lopes
 */
@Injectable()
export class TutoredsService {


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

  findTutoreds(code, name, surname, phone) {
   const params = new HttpParams()
   .set('code', code)
   .set('name', name)
   .set('surname', surname)
   .set('phoneNumber', phone);
  return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/tutoreds', {params});
  }

  findTutoredsByTutor(tutorid, code, name, surname, phone) {
    const params = new HttpParams()
    .set('tutorId', tutorid)
    .set('code', code)
    .set('name', name)
    .set('surname', surname)
    .set('phoneNumber', phone);
    return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/tutoreds/tutor', {params});
  }

  create(data){
    return this.httpClient.post<any>(myGlobals.API+'/mentoring-integ/services/tutoreds', data);
  }

  update(data){
    return this.httpClient.put<any>(myGlobals.API+'/mentoring-integ/services/tutoreds', data);
  }

  findCareers() {
    return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/careers');
  }

  findCareerPositions(career) {
    return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/careers/'+career);
  }

  findSubmitedSessions(userUUID) {
    return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/mentorships/sessions/'+userUUID);
  }

  findSubmitedSessionsLast12Months(userUUID) {
    return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/mentorships/performed-sessions-months/'+userUUID);
  }

}
