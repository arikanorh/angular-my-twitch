import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-show-chanel",
  templateUrl: "./show-chanel.component.html",
  styleUrls: ["./show-chanel.component.css"]
})
export class ShowChanelComponent implements OnInit {
  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {}
  ngOnInit() {

  }
  url() {
    let id = this.route.snapshot.params.id;
    let src = this.sanitizer.bypassSecurityTrustResourceUrl(
      "https://player.twitch.tv/?channel=" + id + "&html5=1"
    );

    return src;
  }
   
 

}
