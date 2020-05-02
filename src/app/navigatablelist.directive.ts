import {
  Directive,
  ElementRef,
  ContentChildren,
  AfterViewInit,
  OnInit,
  QueryList,
  AfterContentChecked,
  OnDestroy
} from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { TwitchService } from './twitch.service';

@Directive({
  selector: "[appNavigatablelist]"
})
export class NavigatablelistDirective
  implements AfterViewInit, AfterContentChecked, OnDestroy {
  @ContentChildren("nav", { read: ElementRef }) channels: QueryList<ElementRef>;
  focusIndex = 0;
  listener;
  sub: Subscription;

  constructor(private twitch:TwitchService) { }

  ngAfterContentChecked() {
    try {
      if (!this.hasCurrentFocus()) {
        this.focusIndex = 0;
        this.focusCurrentElement();
      }
    } catch (err) { }
  }

  ngAfterViewInit(): void {

    this.listener = document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (!this.hasCurrentFocus()) {
        this.focusIndex = 0;
        this.focusCurrentElement();
        return;
      }

      if (e.key === "ArrowDown") {
        this.focusIndex++;
        this.focusCurrentElement();
      } else if (e.key === "ArrowUp") {
        if(this.focusIndex==0){
            this.twitch.loadFavs();
        }
        this.focusIndex--;
        this.focusCurrentElement();
      } else if (e.key === "Enter") {
        this.channels.toArray()[this.focusIndex].nativeElement.click();
      }
    });
  }
  ngOnDestroy() {
    document.removeEventListener("keypress", this.listener);
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  focusCurrentElement() {
    if (this.focusIndex < 0)
      this.focusIndex = 0;
    else if (this.focusIndex >= this.channels.length) {
      this.focusIndex = this.channels.length - 1;
    }
    let element = this.channels.toArray()[this.focusIndex].nativeElement;
    element.focus();
  }

  hasCurrentFocus() {
    let elem = this.channels.toArray()[this.focusIndex].nativeElement;
    return elem === document.activeElement;
  }

}
