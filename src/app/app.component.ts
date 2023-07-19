import { Component } from '@angular/core';

import * as aeroData from '../assets/aerodinamica.json';
import * as sistData from '../assets/sistemas.json';
import * as instData from '../assets/instrumentos.json';
import * as reglData from '../assets/reglamentacion.json';
import * as procData from '../assets/proc_y_ops.json';
import * as meteData from '../assets/meteorologia.json';
import * as svMeData from '../assets/serv_meteorologicos.json';
import * as perfData from '../assets/performance.json';
import * as naveData from '../assets/navegacion.json';

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
export class AppComponent {
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

  openTopicView(i?: number): void {
    this.view = GlobalConstants.TOPIC;
    if (i != undefined) {
      this.currentTopic = this.topics[i];
    } else {
      let allQ: any[] = [];
      for (let i = 0; i < this.topics.length; i++) {
        allQ = allQ.concat(this.topics[i].questions);
      }
      this.currentTopic = {
        questions: allQ,
      };
    }
  }

  close(): void {
    this.currentTopic = undefined;
    this.view = GlobalConstants.MENU;
  }
}
