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
import { ModalComponent } from '../modal/modal.component';
import { TwitchService } from '../twitch.service';
import { NewChannelComponent } from '../channel-component/new-channel/new-channel.component';

@Component({
  selector: "app-show-chanel",
  templateUrl: "./show-chanel.component.html",
  styleUrls: ["./show-chanel.component.css"]
})
export class ShowChanelComponent implements OnInit {
  @ViewChild("video") video: ElementRef;
  @ViewChild(ModalComponent) modal: ModalComponent;
  @ViewChild(ModalComponent,{read:ElementRef}) modalRef: ElementRef;
  data$;
  url;
  listener;
  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private twitch: TwitchService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.url = this.getUrl(params.id);

    })

    this.listener = document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        if (!this.modal.isShowing()) {
          this.modal.show();
          setTimeout(() => {
             this.modalRef.nativeElement.focus();
          }, 1000);


        }
      }else if (e.key==="ArrowDown"){
        this.modal.hide();
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
