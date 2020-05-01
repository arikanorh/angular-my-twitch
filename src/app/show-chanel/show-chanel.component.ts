import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { ModalComponent } from "../modal/modal.component";
import { TwitchService } from "../twitch.service";
import { NewChannelComponent } from "../channel-component/new-channel/new-channel.component";

@Component({
  selector: "app-show-chanel",
  templateUrl: "./show-chanel.component.html",
  styleUrls: ["./show-chanel.component.css"]
})
export class ShowChanelComponent implements OnInit {
  @ViewChild("video") video: ElementRef;
  @ViewChild(ModalComponent) modal: ModalComponent;
  @ViewChild(ModalComponent, { read: ElementRef }) modalRef: ElementRef;
  data$;
  url;
  listener;
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
      console.log(e.key);
      if (e.key === "ArrowUp") {
        if (!this.modal.isShowing()) {
          // this.modal.show();
          this.video.nativeElement.webkitRequestFullScreen();
        }
      } else if (e.key === "ArrowDown") {
        this.modal.hide();
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        this.modal.show(); 
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
}
