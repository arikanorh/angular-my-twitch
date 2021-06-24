import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @Input() value;
  game_id;
  game_name;
  game_image;
  game_viewers;

  constructor() {
  }

  ngOnInit() {
    this.game_id = this.value.id;
    this.game_name = this.value.name;
    this.game_image = this.value.box_art_url
      .replace('{width}', '150')
      .replace('{height}', '210');
    this.game_viewers = this.value.viewers;
  }
}
