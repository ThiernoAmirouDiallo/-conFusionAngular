import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Dish } from '../shared/dish';
import 'rxjs/add/operator/switchMap';

import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DishdetailComponent implements OnInit {
  
    dish: Dish;
    id: number;
    dishIds: number[];
    prev: number;
    next: number;
  
    constructor(private dishservice: DishService,
      private route: ActivatedRoute,
      private location: Location) { }
  
      ngOnInit() {
        this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
        this.route.params
          .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
          .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
      }
      setPrevNext(dishId: number) {
        let index = this.dishIds.indexOf(dishId);
        this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds
          .length];
        this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds
          .length];
      }
  
    goBack(): void {
      this.location.back();
    }
  
  }