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
import { MatSnackBar } from '@angular/material/snack-bar';
import Question from '../interfaces/question.interface';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  private dbPath = 'question-list';
  private database: Database = inject(Database);
  private _snackBar: MatSnackBar = inject(MatSnackBar);

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
    set(ref(this.database, this.dbPath + '/' + id + '/saved'), saved).then(
      () => {
        if (saved === 'true') {
          this._snackBar.open('Pregunta guardada exitosamente!', 'Cerrar', {
            duration: 3000,
          });
        }
      }
    );
  }

  shuffleQuestions(array: Question[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
