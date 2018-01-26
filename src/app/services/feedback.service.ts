import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { Observable } from 'rxjs/Observable';
import { Restangular } from 'ngx-restangular/dist/esm/src/ngx-restangular';

@Injectable()
export class FeedbackService {

  constructor(private restangular: Restangular) { }


  //post feedback
  submitFeedback(feedback : any): Observable<Feedback> {
    return this.restangular.all("feedback").post(feedback); 
  }
}
