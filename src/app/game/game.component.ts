import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../model/Game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @Input() value:Game;
   

  constructor() {
  }

  ngOnInit() {
  //  console.log("Game Init ->"+this.value.name)
  }
}
