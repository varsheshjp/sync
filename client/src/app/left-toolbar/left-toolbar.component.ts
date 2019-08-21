import {Component, OnInit} from '@angular/core';
import { SvgLayoutService } from '../Services/svg-layout/svg-layout.service';
declare const SVG:any;

@Component({
  selector: 'ngp-left-toolbar',
  templateUrl: 'left-toolbar.component.html',
  styleUrls: ['left-toolbar.component.scss']
})
export class LeftToolbarComponent implements OnInit {
  circleDrawToolLayout = null;
  rectDrawToolLayout = null;

  constructor(private sls: SvgLayoutService) {
  }

  ngOnInit() {
    this.svgInit();
  }

  svgInit() {
    this.circleDrawToolLayout = SVG('circle-draw-tool')
      .size(25, 25)
      .circle(25)
      .fill(this.sls.getDrawTools().getCurrentDrawToolColor());

    this.rectDrawToolLayout = SVG('rect-draw-tool')
      .size(25, 25)
      .rect(25, 25)
      .fill(this.sls.getDrawTools().getCurrentDrawToolColor());
  }

  selectDrawTool(e) {
    let drawToolId: number = parseInt(e.currentTarget.getAttribute('data-drawtoolid'));
    if (this.sls.getDrawTools().getCurrentDrawToolId() !== drawToolId) {

      if ((this.sls.getDrawTools().getDrawTools()['3']['id'] === drawToolId)) {
        this.sls.draggableDrawingElements(true);
      }

      this.sls.getDrawTools().setCurrentDrawToolId(drawToolId);
      this.sls.sendCurrentDrawToolSelected();

      if (this.sls.getDrawTools().getPreviousDrawToolId() === this.sls.getDrawTools().getDrawTools()['3']['id']) {
        this.sls.draggableDrawingElements(false);
      }
    }
  }

  changedDrawColor(e) {
    if (this.sls.getDrawTools().getCurrentDrawToolName() === 'rect') {
      this.rectDrawToolLayout.fill(e);
    }

    if (this.sls.getDrawTools().getCurrentDrawToolName() === 'circle') {
      this.circleDrawToolLayout.fill(e);
    }
  }
}
