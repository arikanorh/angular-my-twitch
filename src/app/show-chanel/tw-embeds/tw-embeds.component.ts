import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tw-embeds',
  templateUrl: './tw-embeds.component.html',
  styleUrls: ['./tw-embeds.component.css']
})
export class TwEmbedsComponent implements OnInit {
  @ViewChild("embed") video: ElementRef;

  showList: boolean = false;

  id;
  playAll: boolean = false;
  lastStreamId;
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id');

    this.route.params.subscribe(params => {

      if (this.id !== params.id) {
        this.lastStreamId = this.id;
        this.id = params.id;
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

          this.router.navigate(['embeds', this.lastStreamId]);

        }
      }
    }
  };

  onReady(e) {

  }

  toggleList() {
    this.showList = !this.showList;
  }
}
