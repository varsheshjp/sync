import {Component, OnInit, ElementRef, AfterViewInit} from '@angular/core';
import {ByParamsComponent} from "../by-params/by-params.component";
declare const canvg: any;
declare const saveAs: any;

@Component({
  selector: 'ngp-img-saver',
  templateUrl: 'img-saver.component.html',
  styleUrls: ['img-saver.component.scss']
})
export class ImgSaverComponent extends ByParamsComponent implements OnInit, AfterViewInit {
  canvas: HTMLCanvasElement;
  canvasSize: any;

  constructor(private el: ElementRef) {
    super();
  }

  ngOnInit() {
    this.canvasSize = this.params.canvasSize;
  }

  ngAfterViewInit() {
    this.canvas = this.el.nativeElement.querySelector('#canvas-snapshot');
    canvg(this.canvas, this.params.svgString);

    let dataUrl = this.canvas.toDataURL('image/png');
    let data = atob(dataUrl.substring('data:image/png;base64,'.length));
    let asArray = new Uint8Array(data.length);

    for (let i = 0, len = data.length; i < len; ++i) {
      asArray[i] = data.charCodeAt(i);
    }

    let blob = new Blob([asArray.buffer], {type: 'image/png'});
    saveAs(blob, 'export_' + Date.now() + '.png');
  }
}
