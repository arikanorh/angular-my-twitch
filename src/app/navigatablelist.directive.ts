import {
  Directive,
  ElementRef,
  ContentChildren,
  AfterViewInit,
  QueryList,
  AfterContentChecked,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TwitchService } from './twitch.service';

@Directive({
  selector: '[appNavigatablelist]'
})
export class NavigatablelistDirective
  implements AfterViewInit, AfterContentChecked, OnDestroy {
  @ContentChildren('nav', { read: ElementRef }) channels: QueryList<ElementRef>;
  @Output() onload = new EventEmitter<void>();
  focusIndex = 0;
  listener;
  sub: Subscription;
  vertical: boolean = false;
  rowCount = 1;

  constructor(private twitch: TwitchService) {}

  ngAfterContentChecked() {
    try {
      if (!this.hasCurrentFocus()) {
        this.focusIndex = 0;
        this.focusCurrentElement();
      }
    } catch (err) {}
    this.vertical = this.isVertical(this.channels.toArray());
    this.rowCount = this.getRowCount(this.channels.toArray());
  }

  ngAfterViewInit(): void {
    window.addEventListener('keydown', this.eventListener);
  }
  ngOnDestroy() {
    window.removeEventListener('keydown', this.eventListener);
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  eventListener = (e: KeyboardEvent) => {
    let backwards = 'ArrowLeft';
    let forwards = 'ArrowRight';
    let nextRow = 'ArrowDown';
    let previousRow = 'ArrowUp';
    let preventDefault = ['ArrowUp', 'ArrowDown'];
    let refreshKeys = ['ArrowLeft', 'ArrowUp'];
    if (this.vertical) {
      backwards = 'ArrowUp';
      forwards = 'ArrowDown';
      previousRow = 'ArrowLeft';
      nextRow = 'ignore';
      preventDefault = [];
      refreshKeys = ['ArrowUp'];
    }
    if (preventDefault.indexOf(e.key) >= 0) {
      e.preventDefault();
    }
    if (this.focusIndex === 0 && refreshKeys.indexOf(e.key) >= 0) {
      this.onload.emit();
    }

    if (!this.hasCurrentFocus()) {
      this.focusIndex = 0;
      this.focusCurrentElement();
    } else if (e.key === previousRow) {
      this.focusIndex -= this.rowCount;
      this.focusCurrentElement();
    } else if (e.key === forwards) {
      this.focusIndex++;
      this.focusCurrentElement();
    } else if (e.key === nextRow) {
      this.focusIndex += this.rowCount;
      this.focusCurrentElement();
    } else if (e.key === backwards) {
      this.focusIndex--;
      this.focusCurrentElement();
      e.preventDefault();
    } else if (e.key === 'Enter') {
      this.channels.toArray()[this.focusIndex].nativeElement.click();
    }

    if (this.focusIndex === 0) {
      document.querySelector('.router').scrollTo(0, 0);
    }

    return false;
  };

  focusCurrentElement() {
    if (this.focusIndex < 0) this.focusIndex = 0;
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

  isVertical(elements: ElementRef[]) {
    let result: boolean = true;

    if (elements.length > 1) {
      let firstTop = elements[0].nativeElement.offsetTop;
      let secondTop = elements[1].nativeElement.offsetTop;
      return firstTop !== secondTop;
    }

    return result;
  }

  getRowCount(elements: ElementRef[]) {
    let currentIndex = 0;
    let equals = true;
    while (equals && currentIndex < elements.length - 2) {
      let firstTop = elements[currentIndex].nativeElement.offsetTop;
      let secondTop = elements[currentIndex + 1].nativeElement.offsetTop;
      equals = firstTop === secondTop;
      currentIndex++;
    }
    return currentIndex;
  }
}
