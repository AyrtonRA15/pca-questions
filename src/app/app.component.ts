import { Component, OnInit } from '@angular/core';
import * as questionsData from '../assets/pca_questions.json';
import { GlobalConstants } from '../global-constants';

type View = typeof GlobalConstants.MENU | typeof GlobalConstants.TOPIC;
type ViewMode =
  | typeof GlobalConstants.NO_ANSWER
  | typeof GlobalConstants.ANSWERS_ONLY
  | typeof GlobalConstants.INSTANT_ANSWER;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  data: any = questionsData;
  currentTopic: any = {};
  topics: any[] = [];
  view: View = GlobalConstants.MENU;
  mode: ViewMode = GlobalConstants.NO_ANSWER;
  isRandom: boolean = false;

  ngOnInit(): void {
    this.topics = this.data?.topics;
  }

  openTopicView(i: number): void {
    this.view = GlobalConstants.TOPIC;
    this.currentTopic = this.topics[i];
  }

  close(): void {
    this.currentTopic = undefined;
    this.view = GlobalConstants.MENU;
  }
}
