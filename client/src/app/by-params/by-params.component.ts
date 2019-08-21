import {Component, Input, ComponentRef} from '@angular/core';

@Component({
  selector: 'ngp-by-params',
  template: '<ng-content></ng-content>'
})
export class ByParamsComponent {
  @Input('params') params: any;
  @Input('ctx') ctx: ComponentRef<any>;
}
