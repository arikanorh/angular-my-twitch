import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
 
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  showModal: boolean = false;
  @Input() popuptitle: string;
  @Output() ok = new EventEmitter();
  @Output() cancel = new EventEmitter();

  constructor(router:Router) {
    router.events.subscribe(e=>{
      if(e instanceof NavigationStart){
        this.hide();
      }
    })
   }

  ngOnInit() {
  }
  public hide() {
    this.showModal = false;
  }

  public show() {
    this.showModal = true;
  }

  onOk(e) {
    this.ok.emit(e);
  }
  onCancel(e) {
    this.hide();
    this.cancel.emit(e);
  }

  public setTitle(title:string){
    this.popuptitle=title;
  }

  public isShowing():boolean{
    return this.showModal;
  }

}
