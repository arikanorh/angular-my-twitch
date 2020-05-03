import { Component, OnInit } from '@angular/core';
 import { Observable } from 'rxjs';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  loading:Observable<boolean>;
  constructor(private loader:LoadingService) { }

  ngOnInit() {
    this.loading = this.loader.isLoading();
  }

}