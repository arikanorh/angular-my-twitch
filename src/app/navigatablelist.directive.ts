import { Directive, ElementRef, ContentChildren, AfterViewInit, OnInit, QueryList } from '@angular/core';

@Directive({
  selector: '[appNavigatablelist]'
})
export class NavigatablelistDirective implements  AfterViewInit {

  @ContentChildren("nav", { read: ElementRef }) channels: QueryList<ElementRef>;
  focusIndex = 0;
  listener;

  constructor(private el: ElementRef) { }


  ngAfterViewInit(): void {

    this.channels.changes.subscribe(items => {

      let array = items.toArray();
      for (let index = 0; index < array.length; index++) {
        let element = array[index];
        element.nativeElement.setAttribute("tabindex", index);
      }
      this.focusCurrentElement();
    })

    this.listener = document.addEventListener("keydown", (e: KeyboardEvent) => {
       
      if (e.key === "ArrowRight") {

        this.focusIndex++;
        this.focusIndex = this.focusIndex >= this.channels.length ? 0 : this.focusIndex;
        this.focusCurrentElement();
      }
      else if (e.key === "ArrowLeft") {
        this.focusIndex--;
        this.focusIndex = this.focusIndex < 0 ? this.channels.length - 1 : this.focusIndex;
        this.focusCurrentElement();
      }
      else if (e.key === "Enter") {
         this.channels.toArray()[this.focusIndex].nativeElement.click();
      }
    });

  }
  ngOnDestroy() {
    document.removeEventListener("keypress", this.listener);
  }


  focusCurrentElement() {
    if (this.focusIndex < 0)
      this.focusIndex = this.channels.length - 1;
    else if (this.focusIndex >= this.channels.length)
      this.focusIndex = 0;
    let element = this.channels.toArray()[this.focusIndex].nativeElement;
    element.focus();
  }

}
