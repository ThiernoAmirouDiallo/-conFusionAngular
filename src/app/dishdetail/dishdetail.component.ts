import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import 'rxjs/add/operator/switchMap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { visibility,flyInOut,expand } from '../animations/app.animation';
import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {
  
    dish: Dish;
    dishcopy = null;
    id: number;
    dishIds: number[];
    prev: number;
    next: number;
    commentForm: FormGroup;
    comment: Comment;
    commentP: Comment;
    previewComment: Comment;
    errMess: string;    
    visibility='shown';
    formErrors = {
      'author': '',
      'comment': ''
    };
    validationMessages = {
      'author': {
        'required':      'Author is required.',
        'minlength':     'Author must be at least 2 characters long.',
        'maxlength':     'Author cannot be more than 25 characters long.'
      },
      'comment': {
        'required':      'Comment is required.',
      }
    };
  
    constructor(private dishservice: DishService,
      private route: ActivatedRoute,
      private location: Location,
      private fb: FormBuilder,
      @Inject('BaseURL') private BaseURL) { 
        this.createForm();
      }

      
  
      ngOnInit() {
        this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds,
          errmess => this.errMess = <any>errmess);
        this.route.params
          .switchMap((params: Params) => {this.visibility = 'hidden'; return this.dishservice.getDish(+params['id'])})
          .subscribe(dish => { this.dish = dish;  this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; });
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

    
  
    createForm() {
      this.commentForm = this.fb.group({
        author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        rating: ['5', [] ],
        comment: ['', [Validators.required] ],
      });
  
      this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));
      this.onValueChanged(); // (re)set validation messages now
    }
    onSubmit() {
      this.commentP = this.commentForm.value;
      this.commentP.date=(new Date()).toISOString();
      this.dishcopy.comments.push(this.commentP);
      this.dishcopy.save()
        .subscribe(dish => { this.dish = dish; this.comment=null; this.previewComment=null; console.log(this.dish); });
      //console.log(this.commentP);
      this.commentForm.reset({
        author: '',
        rating: '5',
        comment: ''

      });
    }
    
    onValueChanged(data?: any) {
      this.previewComment=null;
      if (!this.commentForm) { return; }
      const form = this.commentForm;
      for (const field in this.formErrors) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
      if (this.commentForm.status==="VALID")
      {
        this.previewComment=this.commentForm.value;
      }
    }
  
  
  }