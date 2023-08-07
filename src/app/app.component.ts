import { Component, OnInit, inject } from '@angular/core';

import { GlobalConstants } from '../global-constants';
import { QuestionsService } from './services/questions.service';
import { Subscription } from 'rxjs';
import Question from './interfaces/question.interface';

type View = typeof GlobalConstants.MENU | typeof GlobalConstants.TOPIC;
type ViewMode =
  | typeof GlobalConstants.NO_ANSWER
  | typeof GlobalConstants.ANSWERS_ONLY
  | typeof GlobalConstants.INSTANT_ANSWER;

const topics = [
  {
    name: 'Aerodinámica Básica',
    icon: 'air',
  },
  {
    name: 'Sistemas de Aeronaves',
    icon: 'miscellaneous_services',
  },
  {
    name: 'Instrumentos de Vuelo',
    icon: 'hdr_strong',
  },
  {
    name: 'Reglamentación',
    icon: 'gavel',
  },
  {
    name: 'Procedimientos y Operaciones de Aeródromos',
    icon: 'flight_takeoff',
  },
  {
    name: 'Meteorología',
    icon: 'thunderstorm',
  },
  {
    name: 'Servicios Meteorológicos',
    icon: 'rss_feed',
  },
  {
    name: 'Performance de la Aeronave',
    icon: 'insert_chart_outlined',
  },
  {
    name: 'Navegación',
    icon: 'near_me',
  },
  {
    name: 'Ver Todos',
    icon: 'grid_view',
  },
  {
    name: 'Ver Guardadas',
    icon: 'bookmark',
  },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  topics = topics;
  currentTopic: any = {};
  view: View = GlobalConstants.MENU;
  mode: ViewMode = GlobalConstants.NO_ANSWER;
  isRandom = false;

  questionService = inject(QuestionsService);
  questionsSubs = new Subscription();
  allQuestions: Question[] = [];
  currentQuestions: Question[] = [];

  ngOnInit(): void {
    this.questionService
      .getQuestions()
      .subscribe((qns: any) => (this.allQuestions = qns));
    // .subscribe((qns: any) => console.log(qns));
  }

  openTopicView(i: number): void {
    this.view = GlobalConstants.TOPIC;

    if (i < 9) {
      this.currentQuestions = this.allQuestions.filter(
        (qn) => qn.topic === (i + 1).toString()
      );
    } else if (i === 9) {
      this.currentQuestions = this.allQuestions;
    } else {
      this.currentQuestions = this.allQuestions.filter(
        (qn) => qn.saved === 'true'
      );
    }
  }

  close(): void {
    this.currentQuestions = [];
    this.questionsSubs.unsubscribe();
    this.view = GlobalConstants.MENU;
  }
}
