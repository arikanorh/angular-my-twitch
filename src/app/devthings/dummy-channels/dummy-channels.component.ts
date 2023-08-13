import { Component, OnInit } from '@angular/core';
import { dummydata } from '../DummyStream';

@Component({
  selector: 'app-dummy-channels',
  templateUrl: './dummy-channels.component.html',
  styleUrls: ['./dummy-channels.component.css']
})
export class DummyChannelsComponent implements OnInit {

  data:any[] = dummydata.data;
  constructor() { }

  ngOnInit() {
  }

  trackByFn(index,channel) {
    return channel.id;
  }

}
