import {Component, OnInit} from '@angular/core';
import {ByParamsComponent} from "../by-params/by-params.component";
import { Colors } from '../classes/colors.class';

@Component({
  selector: 'ngp-color-palette',
  templateUrl: 'color-palette.component.html',
  styleUrls: ['color-palette.component.scss']
})
export class ColorPaletteComponent extends ByParamsComponent implements OnInit {
  currentTabView: string;
  colors: Colors;

  constructor() {
    super();
    this.tabManager('red');
    this.colors = new Colors();
  }

  ngOnInit() {
  }

  overlayClick(e) {
    if (e.target.className === 'overlay') {
      this.ctx.destroy();
    }
  }

  exit(e) {
    this.ctx.destroy();
  }

  tabManager(col: string): void {
    console.log(col);
    this.currentTabView = col;
  }
}
