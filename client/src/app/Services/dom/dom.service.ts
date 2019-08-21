import {Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef} from '@angular/core';
import { ImgSaverComponent } from '../../img-saver/img-saver.component';


@Injectable()
export class DomService {
  private components: any;

  constructor(private cfr: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector) {
    this.components = [];
  }

  downloadPicture(canvasSize: any, timeOut: number) {
    let svgString = new XMLSerializer().serializeToString(document.body.querySelector('#canvas').childNodes[0]);
    this.appendComponentBySelector(ImgSaverComponent, 'body', {
      svgString: svgString,
      canvasSize: canvasSize
    }, timeOut);
  }

  appendComponentBySelector(component: any, selector: string, params?: any, timeOut?: number) {
    const componentRef = this.cfr.resolveComponentFactory(component).create(this.injector);
    componentRef.instance['params'] = params;
    componentRef.instance['ctx'] = componentRef;

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.querySelector(selector).appendChild(domElem);

    if (timeOut) {
      setTimeout(() => {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
      }, timeOut);
    }

    return componentRef;
  }
}
