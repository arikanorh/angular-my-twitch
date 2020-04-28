import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-show-chanel",
  templateUrl: "./show-chanel.component.html",
  styleUrls: ["./show-chanel.component.css"]
})
export class ShowChanelComponent implements OnInit {

  url;
  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {}
  
  ngOnInit() {
 
    let id = this.route.snapshot.params.id;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
      "https://player.twitch.tv/?channel=" + id + "&html5=1"
    );

   }
   
 

}
