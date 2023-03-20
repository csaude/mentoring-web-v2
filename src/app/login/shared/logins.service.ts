import { Injectable } from '@angular/core';
import {HttpClient,HttpParams} from '@angular/common/http';
import * as myGlobals from '../../../globals';

/**
* @author damasceno.lopes
*/
@Injectable()
export class LoginsService {

  constructor(private httpClient: HttpClient) {
  }

  findOneUserByCredentials(usercreds) {
    return this.httpClient.post(myGlobals.API+ "/account-manager-web/services/users",usercreds);
  }

  resetPass(data){
    return this.httpClient.put<any>(myGlobals.API+'/mentoring-integ/services/tutors/reset-password', data);
  }

}
