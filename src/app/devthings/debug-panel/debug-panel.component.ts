import { Component, OnInit } from '@angular/core';
import { DebugService } from '../debug-service.service';

@Component({
  selector: 'app-debug-panel',
  templateUrl: './debug-panel.component.html',
  styleUrls: ['./debug-panel.component.css']
})
export class DebugPanelComponent implements OnInit {

  logs = [];
  original = [];
  visible: boolean = false;
  expanded: boolean = false;
  left: boolean = true;
  constructor(private debugService: DebugService) {
    debugService.getLogs().subscribe(e => {
      this.original.push(e);
      this.logs = this.original.slice().reverse();
    })

    debugService.onvisible().subscribe(e => {
      this.visible = e;
      if (e) {
        this.expanded = true;
      }
    })
  }

  ngOnInit() {


    window.addEventListener("keydown", (e) => {

      if (e.key === "ArrowRight" && e.ctrlKey) {
        this.left = false;
      } else if (e.key === "ArrowLeft" && e.ctrlKey) {
        this.left = true;
      } else if (e.key === "ArrowDown" && e.ctrlKey) {
        this.expanded = false;
      } else if (e.key === "ArrowUp" && e.ctrlKey) {
        this.expanded = true;
      } else if (e.key === "Enter" && e.ctrlKey) {
        this.visible = !this.visible;
      }
    })

  }
  clearLogs() {
    this.original = [];
    this.logs = [];
    this.debugService.addLog("Logs cleared");
  }
  close() {
    this.debugService.setVisible(false);
  }
}
