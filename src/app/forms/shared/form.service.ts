import { Injectable } from '@angular/core';
import {HttpClient,HttpParams} from '@angular/common/http';
import * as myGlobals from '../../../globals';
import { Subject } from 'rxjs';


/**
 * @author damasceno.lopes
 */
@Injectable()
export class FormsService {

  
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

  findForms(code, name, pa) {
    var params = new HttpParams();
    if(pa==""){
    params = new HttpParams()
   .set('code', code)
   .set('name', name);
    }
else{
   params = new HttpParams()
  .set('code', code)
  .set('name', name)
  .set('programmaticAreaCode', pa);
}
  return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/forms', {params});
  }

  findFormTypes() {
    var params = new HttpParams();
  return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/utils/formtypes', {params});
  }

  findFormQuestions(id) {
    var params = new HttpParams()
    .set("formId",id);
  return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/formquestions', {params});
  }

  create(data){
    return this.httpClient.post<any>(myGlobals.API+'/mentoring-integ/services/forms', data);
  }

  update(data){
    return this.httpClient.put<any>(myGlobals.API+'/mentoring-integ/services/forms', data);
  }

  findPartners() {
    return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/v2/partners');
  }
}