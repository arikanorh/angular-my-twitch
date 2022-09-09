import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { TwitchService } from '../twitch.service';
import { LiveStream } from '../model/Livestream';

@Component({
  selector: 'app-show-chanel',
  templateUrl: './show-chanel.component.html',
  styleUrls: ['./show-chanel.component.css'],
})
export class ShowChanelComponent implements OnInit {
  @ViewChild('wrapper') video: ElementRef;
  data$;

  showList: boolean = false;
  second: boolean = true;
  streams: LiveStream[] = [];
  lastDeleted;
  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private twitch: TwitchService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      let stream: LiveStream = { url: this.getUrl(params.id), id: params.id };

      if (this.streams.find((e) => e.id === stream.id)) return;
      let localUrls = this.streams.slice();
      localUrls.push(stream);
      if (localUrls.length > 2) {
        this.lastDeleted = localUrls.shift();
      }
      this.streams = localUrls;
      // if (this.second) {
      //   this.url2 = newUrl;
      //   this.second = false;
      // } else {
      //   this.second = true;
      //   this.url = newUrl;
      // }
    });

    window.addEventListener('keydown', this.eventListener);
    this.data$ = this.twitch.getFavStreams();
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.eventListener);
  }

  eventListener = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      if (!this.showList) {
        this.video.nativeElement.webkitRequestFullScreen();
      }
    } else if (e.key === 'ArrowRight') {
      this.toggleShow();
      // this.modal.hide();
    } else if (e.key === 'ArrowLeft') {
      this.toggleShow();
    } else if (e.key === 'Enter') {
      this.showList = false;
    } else if (e.key === 'ArrowDown') {
      if (!this.showList) {
        if (this.streams.length > 1) {
          this.lastDeleted = this.streams.shift();
        } else if (this.streams.length == 1) {
          if (this.lastDeleted) {
            let localUrls = this.streams.slice();
            localUrls.push(this.lastDeleted);
            this.lastDeleted = localUrls.shift();
            this.streams = localUrls;
          }
        }
      }
    }
  };

  getUrl(id: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://player.twitch.tv/?channel=' +
        id +
        '&html5=1&parent=' +
        this.getBaseUrl()
    );
  }

  toggleShow() {
    let currentShow = this.showList;
    let nextShow = !currentShow;
    if (nextShow) {
      this.video.nativeElement.focus();
    }
    this.showList = nextShow;
  }

  getBaseUrl() {
    return window.location.hostname;
  }

  loaded1() {
    console.log('Loaded 1');
  }

  closeVideo(index) {
    this.streams.splice(index, 1);
  }

  toggleList() {
    this.showList = !this.showList;
  }
}
