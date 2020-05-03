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
import { TwitchService } from "./twitch.service";

@Directive({
  selector: "[appNavigatablelist]"
})
export class NavigatablelistDirective
  implements AfterViewInit, AfterContentChecked, OnDestroy {
  @ContentChildren("nav", { read: ElementRef }) channels: QueryList<ElementRef>;
  focusIndex = 0;
  listener;
  sub: Subscription;
  vertical:boolean=false;

  constructor(private twitch: TwitchService) {}

  ngAfterContentChecked() {
    try {
      if (!this.hasCurrentFocus()) {
        this.focusIndex = 0;
        this.focusCurrentElement();
      }
    } catch (err) {}
      this.vertical = this.isVertical(this.channels.toArray());
   }

  ngAfterViewInit(): void {

   
    this.listener = document.addEventListener("keydown", (e: KeyboardEvent) => {
   
      let backwards = "ArrowLeft";
      let forwards = "ArrowRight";
      let top="ArrowUp";
      if(this.vertical){
        backwards="ArrowUp";
        forwards="ArrowDown";
        top="ArrowLeft";
      }
 
      if (!this.hasCurrentFocus()) {
        this.focusIndex = 0;
        this.focusCurrentElement();
      } else if (e.key === top) {
        this.focusIndex = 0;
        this.focusCurrentElement();
      } else if (e.key === forwards) {
        this.focusIndex++;
        this.focusCurrentElement();
        e.preventDefault();
      } else if (e.key === backwards) {
        if (this.focusIndex == 0) {
          this.twitch.loadFavs();
        }
        this.focusIndex--;
        this.focusCurrentElement();
        e.preventDefault();
      } else if (e.key === "Enter") {
        this.channels.toArray()[this.focusIndex].nativeElement.click();
      }
      return false;
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
      this.focusIndex = 0;
    }
    let element = this.channels.toArray()[this.focusIndex].nativeElement;
    element.focus();
  }

  hasCurrentFocus() {
    let elem = this.channels.toArray()[this.focusIndex].nativeElement;
    let hasCurrentFocus = elem === document.activeElement;
    return hasCurrentFocus;
  }

  isVertical(elements:ElementRef[]){
    let result:boolean=true;

    if(elements.length>1){
      let firstTop = elements[0].nativeElement.offsetTop;
      let secondTop = elements[1].nativeElement.offsetTop;
      return firstTop!==secondTop;
    }

    return result;
  }
}
