import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,

} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { TwitchService } from "../twitch.service";

@Component({
  selector: "app-show-chanel",
  templateUrl: "./show-chanel.component.html",
  styleUrls: ["./show-chanel.component.css"]
})
export class ShowChanelComponent implements OnInit {
  @ViewChild("wrapper") video: ElementRef;
  data$;
  url;
  listener;
  showList: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private twitch: TwitchService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.url = this.getUrl(params.id);
    });

    this.listener = window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        if (!this.showList) {
          this.video.nativeElement.webkitRequestFullScreen();
        }
      } else if (e.key === "ArrowRight") {
        this.toggleShow();
        // this.modal.hide();
      } else if (e.key === "ArrowLeft") {
        this.toggleShow();
      } else if (e.key === "Enter") {
        this.showList = false;
      } else if (e.key === "ArrowDown") {
      }
    });
    this.data$ = this.twitch.getFavStreams();
  }

  ngOnDestroy() {
    document.removeEventListener("keypress", this.listener);
  }
  getUrl(id: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      "https://player.twitch.tv/?channel=" + id + "&html5=1"
    );
  }

  toggleShow() {
    let currentShow = this.showList;
    let nextShow = !currentShow;
    if(nextShow){
      this.video.nativeElement.focus();
    }
    this.showList = nextShow;
  }
}
