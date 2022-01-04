import {
  Directive,
  ElementRef,
  ContentChildren,
  AfterViewInit,
  QueryList,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DebugService } from './devthings/debug-service.service';

@Directive({
  selector: '[appNavigatablelist]'
})
export class NavigatablelistDirective implements AfterViewInit, OnDestroy {
  @ContentChildren('nav', { read: ElementRef }) channels: QueryList<ElementRef>;
  @Output() onload = new EventEmitter<void>();
  focusIndex = 0;
  listener;
  sub: Subscription;
  sub2: Subscription;
  vertical: boolean = false;
  rowCount = 1;

  constructor(private debugService: DebugService) {
    this.debugService.addLog("NavigatablelistDirective init");

  }
  ngAfterViewInit(): void {

    this.debugService.addLog("Subbing changess");

    this.sub2 = this.channels.changes.subscribe(e => {

      this.detectLayout();

    });

    if (this.channels) {
      this.detectLayout();
    }


    this.debugService.addLog('registering keydown');

    window.addEventListener('keydown', this.eventListener, false);
    this.debugService.addLog('Keydown registered');
  }


  eventListener = (e: any) => {
    if (e.ignore)
      return;


    let backwards = 'ArrowLeft';
    let forwards = 'ArrowRight';
    let nextRow = 'ArrowDown';
    let previousRow = 'ArrowUp';
    let preventDefault = ['ArrowUp', 'ArrowDown'];
    let refreshKeys = ['ArrowLeft', 'ArrowUp'];
    if (this.vertical) {
      backwards = 'ArrowUp';
      forwards = 'ArrowDown';
      previousRow = '';
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

  private detectLayout() {
    this.debugService.addLog("Detecting layout");
    try {
      if (!this.hasCurrentFocus()) {
        this.focusIndex = 0;
        this.focusCurrentElement();
      }
    } catch (err) { }
    this.vertical = this.isVertical(this.channels.toArray());
    this.rowCount = this.getRowCount(this.channels.toArray());

    this.debugService.addLog('Vertical :' + this.vertical + " Rowc :" + this.rowCount);
  }

  focusCurrentElement() {
    if (this.focusIndex < 0) this.focusIndex = 0;
    else if (this.focusIndex >= this.channels.length) {
      this.focusIndex = 0;
    }
    let element = this.channels.toArray()[this.focusIndex].nativeElement;
    this.debugService.addLog("Focus index :" + this.focusIndex);

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

  ngOnDestroy() {
    this.debugService.addLog("Destroing NavigatablelistDirective")
    window.removeEventListener('keydown', this.eventListener);
    // this.channels.destroy();
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.sub2)
      this.sub2.unsubscribe();
  }
}
