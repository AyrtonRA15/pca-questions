import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import { MatChipOption } from '@angular/material/chips';
import { ResultComponent } from './result/result.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GlobalConstants } from '../../../global-constants';
import { QuestionsService } from '../../services/questions.service';
import Question from '../../interfaces/question.interface';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit {
  @Input() questions: any;
  @Input() mode: any;
  @Input() isRandom = false;
  @Output() cancel = new EventEmitter<any>();

  @ViewChildren('chipOpt') chipOpts: QueryList<MatChipOption> | undefined;
  @ViewChild('closeTemplate') closeTemplate: any;
  @ViewChild('submitTemplate') submitTemplate: any;

  question: Question = {};
  currentQ = 0;
  totalQ = 0;
  // qListOrder: number[] = []; // Array to store order for questions
  ansSelected: any[] = [];

  // Results
  isViewingResults = false;
  totalCorrect = 0;
  score = 0;

  questionService = inject(QuestionsService);
  dialog: MatDialog = inject(MatDialog);

  ngOnInit(): void {
    this.totalQ = this.questions.length;
    // this.qListOrder = Array.from(Array(this.totalQ).keys());
    if (this.isRandom) {
      // this.questions = this.questionService.shuffleQuestions(this.qListOrder);
      this.questions = this.questionService.shuffleQuestions(this.questions);
    }
    this.ansSelected = new Array<string>(this.totalQ);
    this.updateQ();
  }

  updateQ(i = 0): void {
    this.currentQ = i;
    // if (this.questions) {
    this.question = this.questions[this.currentQ];
    // this.question = this.questions[this.qListOrder[this.currentQ]];
    this.chipOpts?.toArray()[this.currentQ].select();
    // }
  }

  changeAns(ans: string): void {
    this.ansSelected[this.currentQ] = ans;
  }

  showExitBtn(): boolean {
    return this.isViewingResults || this.mode != GlobalConstants.NO_ANSWER;
  }

  showCorrectChip(i: number): boolean {
    return (
      this.isViewingResults && this.ansSelected[i] === this.questions[i].ans
    );
  }

  showWrongChip(i: number): boolean {
    return (
      this.isViewingResults && this.ansSelected[i] !== this.questions[i].ans
    );
  }

  saveFav(): void {
    if (this.question.saved === 'false') {
      this.question.saved = 'true';
    } else {
      this.question.saved = 'false';
    }
    this.questionService.saveQuestion(this.question.id, this.question.saved);
  }

  close(confirm: boolean): void {
    if (confirm) {
      const dialogRef = this.dialog.open(this.closeTemplate);
      dialogRef.afterClosed().subscribe((close: boolean) => {
        if (close) {
          this.cancel.emit();
        }
      });
    } else {
      this.cancel.emit();
    }
  }

  submit(): void {
    const submitDialogRef = this.dialog.open(this.submitTemplate);
    submitDialogRef.afterClosed().subscribe((submit: boolean) => {
      if (submit) {
        this.isViewingResults = true;
        this.updateQ();
        this.totalCorrect = this.ansSelected.filter(
          (ans: any, i: number) => this.questions[i].ans === ans
        ).length;
        this.score = Math.round(
          (this.totalCorrect / this.ansSelected.length) * 100
        );

        // Show results dialog
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.data = {
          score: this.score,
          totalCorrect: this.totalCorrect,
          totalQ: this.totalQ,
        };
        const dialogRef = this.dialog.open(ResultComponent, dialogConfig);

        dialogRef.afterClosed().subscribe((viewAnswers: boolean) => {
          if (!viewAnswers) {
            this.close(false);
          }
        });
      }
    });
  }
}
