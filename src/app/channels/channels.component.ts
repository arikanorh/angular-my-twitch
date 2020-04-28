import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { TwitchService } from '../twitch.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {

    channels;
    name;
   constructor(private httpService:HttpClient,route:ActivatedRoute,private twitch:TwitchService){
     this.name = route.snapshot.params.id;

  }

  ngOnInit(){
    this.twitch.getChannelsOfGame(this.name).subscribe(
      e=>{
        this.channels = e.streams;
      }
    );
  }
}