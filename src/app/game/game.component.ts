import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"]
})
export class GameComponent implements OnInit {
  @Input() value;
  game_id;
  game_name;
  game_image;
  game_viewers;

  constructor() {}

  ngOnInit() {
     this.game_id = this.value.game._id;
    this.game_name = this.value.game.name;
    this.game_image = this.value.game.box.medium;
    this.game_viewers = this.value.viewers;
  }
}
