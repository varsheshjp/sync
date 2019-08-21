import {Component, OnInit, ElementRef, AfterViewInit, Output, EventEmitter} from '@angular/core';
import {ColorPaletteComponent} from "../color-palette/color-palette.component";
import { SvgLayoutService } from '../Services/svg-layout/svg-layout.service';
import { DomService } from '../Services/dom/dom.service';
declare const SVG: any;

@Component({
  selector: 'ngp-left-toolbar-draw-options',
  templateUrl: 'left-toolbar-draw-options.component.html',
  styleUrls: ['left-toolbar-draw-options.component.scss']
})
export class LeftToolbarDrawOptionsComponent implements OnInit, AfterViewInit {
  @Output() changedDrawColor = new EventEmitter<String>();

  selectedSize: number;
  selectedColor: string;
  drawToolExampleElement: any = null;
  drawOptionsPanelVisible: boolean = true;

  constructor(public sls: SvgLayoutService, private el: ElementRef, private domService: DomService) {
    this.selectedSize = this.sls.getDrawTools().getCurrentDrawToolPixels();
    this.selectedColor = this.sls.getDrawTools().getCurrentDrawToolColor();
  }

  ngOnInit() {
    this.sls.subsCurrentDrawToolSelected().subscribe(() => {
      this.selectedSize = this.sls.getDrawTools().getCurrentDrawToolPixels();
      this.selectedColor = this.sls.getDrawTools().getCurrentDrawToolColor();

      if (this.sls.getDrawTools().getCurrentDrawToolId() < this.sls.getDrawTools().getDrawToolById(3)['id']) {
        this.drawOptionsPanelVisible = true;
        setTimeout(() => {
          this.el.nativeElement.querySelector('.draw-tool-size-picker').value = this.selectedSize.toString();
          this.drawingToolExampleElement();
        }, 0);
      } else {
        this.drawOptionsPanelVisible = false;
      }
    });
  }

  ngAfterViewInit() {
    this.initSvg().drawingToolExampleElement();
    this.el.nativeElement.querySelector('.draw-tool-size-picker').value = this.selectedSize.toString();
  }

  initSvg() {
    this.drawToolExampleElement = SVG('draw-tool-example-element').size(45, 45);
    return this;
  }

  drawToolSizePickerChanged(e) {
    this.selectedSize = parseInt(e.target.value);
    this.sls.getDrawTools().setCurrentDrawToolPixels(this.selectedSize);
    this.drawingToolExampleElement();
  }

  drawToolColorPickerChanged(e) {
    this.sls.getDrawTools().setCurrentDrawToolColor(e);
    this.changedDrawColor.emit(this.sls.getDrawTools().getCurrentDrawToolColor());
    this.drawingToolExampleElement();
  }

  drawingToolExampleElement() {
    if (this.el.nativeElement.querySelector('#draw-tool-example-element').children.length === 0) {
      this.initSvg();
    } else {
      this.drawToolExampleElement.doc().clear();
    }

    if (this.sls.getDrawTools().getCurrentDrawToolName() === 'rect') {
      this.drawToolExampleElement
        .rect(this.selectedSize, this.selectedSize)
        .fill(this.sls.getDrawTools().getCurrentDrawToolColor())
        .move((45 - this.selectedSize) / 2, (45 - this.selectedSize) / 2);
    }

    if (this.sls.getDrawTools().getCurrentDrawToolName() === 'circle') {
      this.drawToolExampleElement
        .circle(this.selectedSize)
        .fill(this.sls.getDrawTools().getCurrentDrawToolColor())
        .move((45 - this.selectedSize) / 2, (45 - this.selectedSize) / 2);
    }
  }

  openColorPalette(e) {
    this.domService.appendComponentBySelector(ColorPaletteComponent, '.svg-layout-container');
  }
}
