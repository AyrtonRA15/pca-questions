import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { GlobalConstants } from '../../../../global-constants';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit, OnChanges {
  @Input() question: any = {};
  @Input() currentQ: number = 0;
  @Input() currentAns: string | undefined;
  @Input() mode: any;
  @Input() isViewingResults: boolean = false;
  @Output() changeAns = new EventEmitter<any>();

  @ViewChild('opts') opts: MatSelectionList | undefined;

  header: string = '';
  options: any[] = [];
  ans: string = '';
  exp: string = '';
  ansSelected: any = undefined;

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.opts?.deselectAll();
    this.header = this.question.qn;
    this.options = [
      {
        id: 'a',
        text: this.question.a,
      },
      {
        id: 'b',
        text: this.question.b,
      },
      {
        id: 'c',
        text: this.question.c,
      },
    ];
    this.ans = this.question.ans;
    this.exp = this.question.explanation;
  }

  optionChange(selectedOptions: any): void {
    this.changeAns.emit(selectedOptions?.selected[0].value);
  }

  isAnswersOnly(): boolean {
    return this.mode == GlobalConstants.ANSWERS_ONLY;
  }

  isNoAnswer(): boolean {
    return this.mode == GlobalConstants.NO_ANSWER;
  }

  isInstantAnswer(): boolean {
    return this.mode == GlobalConstants.INSTANT_ANSWER;
  }

  isOptionSelected(opt: string): boolean {
    return (
      (this.currentAns && this.currentAns === opt) ||
      (this.isAnswersOnly() && this.ans === opt)
    );
  }

  showWrongAnswer(opt: string): boolean {
    if (
      (this.isInstantAnswer() && !!this.currentAns) ||
      (this.isNoAnswer() && this.isViewingResults)
    ) {
      return this.currentAns === opt && this.currentAns !== this.ans;
    }
    return false;
  }

  showCorrectAnswer(opt: string): boolean {
    if (this.isInstantAnswer() && !!this.currentAns) {
      return this.currentAns === opt && this.currentAns === this.ans;
    } else if (
      this.isAnswersOnly() ||
      (this.isNoAnswer() && this.isViewingResults)
    ) {
      return this.ans === opt;
    }
    return false;
  }

  showExplanation(): boolean {
    return (
      this.isAnswersOnly() ||
      (this.isInstantAnswer() && !!this.currentAns) ||
      (this.isNoAnswer() && this.isViewingResults)
    );
  }
}
