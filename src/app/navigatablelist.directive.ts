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

@Directive({
  selector: "[appNavigatablelist]"
})
export class NavigatablelistDirective
  implements AfterViewInit, AfterContentChecked, OnDestroy {
  @ContentChildren("nav", { read: ElementRef }) channels: QueryList<ElementRef>;
  focusIndex = 0;
  listener;
  sub: Subscription;

  constructor(private el: ElementRef) {}

  ngAfterContentChecked() {
    try {
      if (!this.hasCurrentFocus()) {
        this.focusIndex = 0;
        this.focusCurrentElement();
      }
    } catch (err) {}
  }

  ngAfterViewInit(): void {
    let array = this.channels.toArray();
    if (array.length !== 0) {
      this.setTabIndexesAndFocus(array);
    } else
      this.sub = this.channels.changes.subscribe(items => {
        let array = items.toArray();
        this.setTabIndexesAndFocus(array);
      });

    this.listener = document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (!this.hasCurrentFocus()) {
        this.focusIndex = 0;
        this.focusCurrentElement();
        return;
      }

      if (e.key === "ArrowRight") {
        this.focusIndex++;
        this.focusIndex =
          this.focusIndex >= this.channels.length ? 0 : this.focusIndex;
        this.focusCurrentElement();
      } else if (e.key === "ArrowLeft") {
        this.focusIndex--;
        this.focusIndex =
          this.focusIndex < 0 ? this.channels.length - 1 : this.focusIndex;
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
    if (this.focusIndex < 0) this.focusIndex = this.channels.length - 1;
    else if (this.focusIndex >= this.channels.length) {
      this.focusIndex = 0;
    }
    let element = this.channels.toArray()[this.focusIndex].nativeElement;
    element.focus();
  }

  hasCurrentFocus() {
    let elem = this.channels.toArray()[this.focusIndex].nativeElement;
    return elem === document.activeElement;
  }

  private setTabIndexesAndFocus(elements: ElementRef[]) {
    for (let index = 0; index < elements.length; index++) {
      let element = elements[index];
      element.nativeElement.setAttribute("tabindex", index);
    }
    this.focusIndex = 0;
    this.focusCurrentElement();
  }
}
