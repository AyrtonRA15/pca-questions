/* eslint-disable no-case-declarations */
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
    name: 'Ver Todas',
    icon: 'grid_view',
  },
  {
    name: 'Ver Guardadas',
    icon: 'bookmark',
  },
  {
    name: 'Test de Prueba',
    icon: 'quiz',
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
  }

  getPracticeTestQns(): Question[] {
    const shuffledQns = this.questionService.shuffleQuestions([
      ...this.allQuestions,
    ]);
    const testQns: Question[] = [];
    const topicCount = Array(9).fill(0);
    let topicsWith6Qns = 0;
    for (const qn of shuffledQns) {
      const indexTopic = Number(qn.topic) - 1;
      if (topicCount[indexTopic] < 6) {
        if (topicCount[indexTopic] === 5) {
          if (topicsWith6Qns < 5) {
            topicsWith6Qns++;
          } else {
            continue;
          }
        }
        testQns.push(qn);
        topicCount[indexTopic]++;
      }
      if (testQns.length === 50) {
        break;
      }
    }
    return testQns;
  }

  openTopicView(i: number): void {
    this.view = GlobalConstants.TOPIC;

    if (i < 9) {
      this.currentQuestions = this.allQuestions.filter(
        (qn) => qn.topic === (i + 1).toString()
      );
    } else {
      switch (i) {
        case 9:
          // Show all
          this.currentQuestions = [...this.allQuestions];
          break;
        case 10:
          // Show saved
          this.currentQuestions = this.allQuestions.filter(
            (qn) => qn.saved === 'true'
          );
          break;
        case 11:
          // Show practice test
          this.currentQuestions = this.getPracticeTestQns();
          break;
      }
    }
  }

  close(): void {
    this.currentQuestions = [];
    this.questionsSubs.unsubscribe();
    this.view = GlobalConstants.MENU;
  }
}
