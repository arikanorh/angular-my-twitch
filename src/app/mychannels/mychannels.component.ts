import { Component, OnInit } from '@angular/core';
import { TwitchService } from '../twitch.service';

@Component({
  selector: 'app-mychannels',
  templateUrl: './mychannels.component.html',
  styleUrls: ['./mychannels.component.css']
})
export class MychannelsComponent implements OnInit {

  data;

  constructor(private twitch:TwitchService) { }

  ngOnInit() {
    this.twitch.getMyFollowedStreams().subscribe(e=>{
      this.data = e;
     })

  }

}