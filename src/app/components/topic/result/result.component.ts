import { Component, Inject, OnInit } from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  animations: [
    trigger('showProgress', [
      state(
        'show',
        style({
          strokeDasharray: '{{strokeDashArrayValue}}',
        }),
        { params: { strokeDashArrayValue: '0, 100' } }
      ),
      transition('* => show', [
        style({ strokeDasharray: '0, 100' }),
        animate('2s ease-out'),
      ]),
    ]),
    trigger('showValue', [
      state(
        'show',
        style({
          opacity: 1,
        })
      ),
      transition('* => show', [style({ opacity: 0 }), animate('1s')]),
    ]),
  ],
})
export class ResultComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { score: number; totalCorrect: number; totalQ: number }
  ) {}

  ngOnInit(): void {}

  getStrokeDashArrayValue(): string {
    return this.data.score + ', ' + (100 - this.data.score);
  }
}
