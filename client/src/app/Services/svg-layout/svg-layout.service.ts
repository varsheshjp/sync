import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import { Subject } from 'rxjs';
import { DrawTools } from '../../classes/draw-tools.class';

@Injectable()
export class SvgLayoutService {
  private picture = new Subject<any>();
  private documentMouseUpEvent = new Subject<any>();
  private currentDrawToolSelected = new Subject<any>();
  private drawEventsStatus = new Subject<boolean>();

  private drawTools: DrawTools;

  drawingElements: any[] = [];
  drawingStorageElements: any[] = [];
  canvasSize: any = {width: null, height: null};

  constructor() {
    this.drawTools = new DrawTools(2);

    this.canvasSize.width = window.innerWidth - 145;
    this.canvasSize.height = window.innerHeight - 42;
  }

  getPicture(): Observable < Text | null > {
    return this.picture.asObservable();
  }

  clearPicture(): void {
    this.clearDrawingElements();
    this.picture.next();
  }

  getDocumentMouseUpEvent(): Observable<null> {
    return this.documentMouseUpEvent.asObservable();
  }

  offDocumentMouseUpEvent(): void {
    this.documentMouseUpEvent.next();
  }

  subsCurrentDrawToolSelected(): Observable<null> {
    return this.currentDrawToolSelected.asObservable();
  }

  sendCurrentDrawToolSelected(): void {
    this.currentDrawToolSelected.next();
  }

  subsDrawEventsStatus(): Observable<boolean> {
    return this.drawEventsStatus.asObservable();
  }

  sendDrawEventsStatus(status: boolean): void {
    this.drawEventsStatus.next(status);
  }

  getCanvasSize() {
    return this.canvasSize;
  }

  addDrawingElement(element): void {
    this.drawingElements.push(element.drawingElement);
    this.drawingStorageElements.push(element.drawingStorageElement);
  }

  getDrawingElements(): {} {
    return {drawingElements: this.drawingElements, drawingStorageElements: this.drawingStorageElements};
  }

  draggableDrawingElements(draggable: boolean): this {
    if (draggable) {
      this.drawingElements.forEach((elem) => {
        console.log(elem);
        elem.draggable().on('dragend.namespace', (e) => {}).style({'cursor': 'move'});
      });
      this.sendDrawEventsStatus(true);
    } else {
      this.drawingElements.forEach((elem) => {
        elem.draggable(false).off('dragend.namespace').style({'cursor': 'default'});
      });
      this.sendDrawEventsStatus(false);
    }
    return this;
  }

  clearDrawingElements(): void {
    this.drawingElements = [];
    this.drawingStorageElements = [];
  }

  getDrawTools(): DrawTools {
    return this.drawTools;
  }
}
