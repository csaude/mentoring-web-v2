import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders,HttpParams} from '@angular/common/http';
import * as myGlobals from '../../../globals';
import { Subject } from 'rxjs';


/**
 * @author damasceno.lopes
 */
@Injectable()
export class ProgrammaticAreasService {

  
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

  findProgrammaticAreas(code, name) {
   const params = new HttpParams()
   .set('code', code)
   .set('name', name);
  return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/programmaticareas', {params});
  }

  create(data){
    let headers = new HttpHeaders();
    headers=headers.set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*');
    return this.httpClient.post<any>(myGlobals.API+'/mentoring-integ/services/programmaticareas', data, { headers: headers });
  }

  update(data){
    return this.httpClient.put<any>(myGlobals.API+'/mentoring-integ/services/programmaticareas', data);
  }

}