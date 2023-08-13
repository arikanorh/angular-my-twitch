import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DebugService {
  private _logs = new ReplaySubject<string>();
  private logs = this._logs.asObservable();

  private _visible = new BehaviorSubject<boolean>(false);
  private visible = this._visible.asObservable();

  counter = 0;

  constructor() {
    if (!environment.production) {
      this._visible.next(true);
    }
  }

  public getLogs() {
    return this.logs;
  }
  public addLog(log: string) {
    this.addLogWith(log, null);
  }
  public addLogWith(log: string, obj: any) {
    let line: string = this.formatDate(new Date()) + ' : ' + log;
    if (obj) {
      line += ' -> ' + JSON.stringify(obj);
    }
    this._logs.next(line);
  }

  public onvisible() {
    return this.visible;
  }

  public setVisible(isvisible: boolean) {
    this._visible.next(isvisible);
  }

  private formatDate(m: Date) {
    return (
      this.padZero(m.getUTCHours()) +
      ':' +
      this.padZero(m.getUTCMinutes()) +
      ':' +
      this.padZero(m.getUTCSeconds())
    );
  }

  private padZero(num: number) {
    if (num < 10) return '0' + num;
    else return num;
  }
}
