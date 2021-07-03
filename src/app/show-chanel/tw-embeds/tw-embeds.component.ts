import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tw-embeds',
  templateUrl: './tw-embeds.component.html',
  styleUrls: ['./tw-embeds.component.css']
})
export class TwEmbedsComponent implements OnInit {
  @ViewChild("embed") video: ElementRef;

  showList: boolean = false;

  streams = [];
  playAll: boolean = false;
  lastStreamId;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.showList = false;
      let id = params.id;

      if (this.streams.length == 1) {
        let firstElement = this.streams.shift();
        firstElement.id = id;
        this.streams.push(firstElement);
      } else {

        this.streams.push({
          id: id,
          playing: true
        });
      }
    })

    window.addEventListener("keydown", this.eventListener);
  }

  ngOnDestroy() {
    window.removeEventListener("keydown", this.eventListener);
  }

  eventListener = (e: KeyboardEvent) => {

    if (e.key === "ArrowUp") {
      if (!this.showList) {
        this.video.nativeElement.webkitRequestFullScreen();
      }
    } else if (e.key === "ArrowRight") {
      this.toggleList();
      // this.modal.hide();
    } else if (e.key === "ArrowLeft") {
      this.toggleList();
    } else if (e.key === "Enter") {
      this.showList = false;
    } else if (e.key === "ArrowDown") {
      if (!this.showList) {
        if (this.lastStreamId) {
          let thisStreamId = this.streams[0].id;
          this.streams[0].id = this.lastStreamId;
          this.lastStreamId = thisStreamId;
        }
      }
    }
  };

  onReady(e) {
    if (e.type == 'VIDEO_READY') {
      console.log(e);
      this.streams.filter(stream => stream.id !== e.id).forEach(e => e.playing = false);
    }

  }

  toggleList() {
    this.showList = !this.showList;
  }
}
