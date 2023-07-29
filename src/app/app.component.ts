import { Component, OnInit } from '@angular/core';

import * as aeroData from '../assets/1_aerodinamica.json';
import * as sistData from '../assets/2_sistemas.json';
import * as instData from '../assets/3_instrumentos.json';
import * as reglData from '../assets/4_reglamentacion.json';
import * as procData from '../assets/5_proc_y_ops.json';
import * as meteData from '../assets/6_meteorologia.json';
import * as svMeData from '../assets/7_serv_meteorologicos.json';
import * as perfData from '../assets/8_performance.json';
import * as naveData from '../assets/9_navegacion.json';

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
  topics = [
    aeroData,
    sistData,
    instData,
    reglData,
    procData,
    meteData,
    svMeData,
    perfData,
    naveData,
  ];
  currentTopic: any = {};
  view: View = GlobalConstants.MENU;
  mode: ViewMode = GlobalConstants.NO_ANSWER;
  isRandom = false;
  allQ: any[] = [];

  ngOnInit(): void {
    for (let i = 0; i < this.topics.length; i++) {
      this.allQ = this.allQ.concat(this.topics[i].questions);
    }
  }

  openTopicView(i?: number): void {
    this.view = GlobalConstants.TOPIC;
    if (i != undefined) {
      this.currentTopic = this.topics[i];
    } else {
      this.currentTopic = {
        questions: this.allQ,
      };
    }
  }

  close(): void {
    this.currentTopic = undefined;
    this.view = GlobalConstants.MENU;
  }
}
