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

  question: any = {};
  currentQ: number = 0;
  totalQ: number = 0;
  ansSelected: any[] = [];

  // Results
  isViewingResults: boolean = false;
  totalCorrect: number = 0;
  score: number = 0;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.totalQ = this.topic?.questions.length;
    this.ansSelected = new Array<string>(this.totalQ);
    this.updateQ();
  }

  updateQ(): void {
    this.question = this.topic.questions[this.currentQ];
    this.chipOpts?.toArray()[this.currentQ].select();
  }

  nextQ(): void {
    this.currentQ++;
    this.updateQ();
  }

  prevQ(): void {
    this.currentQ--;
    this.updateQ();
  }

  chipSelected(i: number): void {
    this.currentQ = i;
    this.updateQ();
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
    this.isViewingResults = true;
    this.totalCorrect = this.ansSelected.filter(
      (ans: any, i: number) => this.topic.questions[i].ans === ans
    ).length;
    // Delete
    this.totalCorrect = 60;
    this.score = Math.round(
      (this.totalCorrect / this.ansSelected.length) * 100
    );
    console.log(this.score);

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
}
