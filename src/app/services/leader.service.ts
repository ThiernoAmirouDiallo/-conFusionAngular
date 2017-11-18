import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { resolve } from 'url';

import { Observable } from 'rxjs/Observable';
//import 'rxjs/Rx';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/delay';


@Injectable()
export class LeaderService {

  constructor() { }

  getLeaders(): Observable<Leader[]> {
    //return Promise.resolve(LEADERS);
    return Observable.of(LEADERS).delay(2000);
  }

  getLeader(id: number): Observable<Leader> {
    //return Promise.resolve(LEADERS.filter((leader) => (leader.id === id))[0]);
    return Observable.of(LEADERS.filter((leader) => (leader.id === id))[0]).delay(2000);
  }

  getFeaturedLeader(): Observable<Leader> {
    //return Promise.resolve(LEADERS.filter((leader) => leader.featured)[0]);
    return Observable.of(LEADERS.filter((leader) => leader.featured)[0]).delay(2000);
  }
}