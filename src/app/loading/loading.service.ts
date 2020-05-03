import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LoadingService {

  _loading$ = new BehaviorSubject(false);
  loading$: Observable<boolean> =this._loading$.asObservable();
  constructor() { }

  public show(){
    this._loading$.next(true);
  }
  public hide(){
    this._loading$.next(false);
  }
 public isLoading():Observable<boolean>{
    return this.loading$;
  } 

}