import { Injectable, inject } from '@angular/core';
import {
  Database,
  equalTo,
  listVal,
  orderByChild,
  query,
  ref,
  set,
} from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  private dbPath = 'question-list';
  private database: Database = inject(Database);

  getQuestions(topic?: string) {
    if (topic) {
      return listVal(
        query(
          ref(this.database, this.dbPath),
          orderByChild('topic'),
          equalTo(topic)
        )
      );
    }
    return listVal(ref(this.database, this.dbPath));
  }

  saveQuestion(id?: string, saved?: string) {
    set(ref(this.database, this.dbPath + '/' + id + '/saved'), saved);
  }
}
