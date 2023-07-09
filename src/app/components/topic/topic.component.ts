import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatChipOption } from '@angular/material/chips';
import { ResultComponent } from './result/result.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GlobalConstants } from '../../../global-constants';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit {
  @Input() topic: any;
  @Input() mode: any;
  @Output() cancel = new EventEmitter<any>();

  @ViewChildren('chipOpt') chipOpts: QueryList<MatChipOption> | undefined;
  @ViewChild('closeTemplate') closeTemplate: any;
  @ViewChild('submitTemplate') submitTemplate: any;

  question: any = {};
  currentQ = 0;
  totalQ = 0;
  ansSelected: any[] = [];

  // Results
  isViewingResults = false;
  totalCorrect = 0;
  score = 0;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.totalQ = this.topic?.questions.length;
    this.ansSelected = new Array<string>(this.totalQ);
    this.updateQ();
  }

  updateQ(i = 0): void {
    this.currentQ = i;
    this.question = this.topic.questions[this.currentQ];
    this.chipOpts?.toArray()[this.currentQ].select();
  }

  changeAns(ans: string): void {
    this.ansSelected[this.currentQ] = ans;
  }

  showExitBtn(): boolean {
    return this.isViewingResults || this.mode != GlobalConstants.NO_ANSWER;
  }

  showCorrectChip(i: number): boolean {
    return (
      this.isViewingResults &&
      this.ansSelected[i] === this.topic.questions[i].ans
    );
  }

  showWrongChip(i: number): boolean {
    return (
      this.isViewingResults &&
      this.ansSelected[i] !== this.topic.questions[i].ans
    );
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
          (ans: any, i: number) => this.topic.questions[i].ans === ans
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
