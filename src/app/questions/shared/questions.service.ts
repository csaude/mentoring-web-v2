import { Injectable } from '@angular/core';
import {HttpClient,HttpParams} from '@angular/common/http';
import * as myGlobals from '../../../globals';
import { Subject } from 'rxjs';


/**
 * @author damasceno.lopes
 */
@Injectable()
export class QuestionsService {


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

  findQuestions(code, name, type) {
   const params = new HttpParams()
   .set('code', code)
   .set('question', name)
   .set('questionType', type);
  return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/questions', {params});
  }

  createQuestion(data){
    return this.httpClient.post<any>(myGlobals.API+'/mentoring-integ/services/questions', data);
  }

  updateQuestion(data){
    return this.httpClient.put<any>(myGlobals.API+'/mentoring-integ/services/questions', data);
  }

  findQuestionTypes() {
   return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/utils/questiontypes');
  }

  findQuestionCategories() {
    return this.httpClient.get<any>(myGlobals.API+'/mentoring-integ/services/question-categories');
  }

  createQuestionsCategory(data){
    return this.httpClient.post<any>(myGlobals.API+'/mentoring-integ/services/question-categories', data);
  }

}
