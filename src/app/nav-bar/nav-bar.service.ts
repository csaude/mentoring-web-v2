import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
@Injectable()
export class NavbarService {

  invokeEvent: Subject<any> = new Subject();

  callMethodOfSecondComponent() {
    this.invokeEvent.next('someVal');
  }
}