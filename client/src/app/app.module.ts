import { BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Rest } from './Services/rest.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { CanvasComponent } from './Canvas/canvas.component';
import { TextComponent } from './Text/text.component';
import { CanvasImageComponent } from './CanvasImage/canvasImage.component';
import { ByParamsComponent } from './by-params/by-params.component';
import { ColorPaletteComponent } from './color-palette/color-palette.component';
import { ImgSaverComponent } from './img-saver/img-saver.component';
import { LeftToolbarDrawOptionsComponent } from './left-toolbar-draw-options/left-toolbar-draw-options.component';
import { LeftToolbarComponent } from './left-toolbar/left-toolbar.component';
import { SvgLayoutComponent } from './svg-layout/svg-layout.component';
import { MainPanelComponent } from './main-panel/main-panel.component';
import {AngularFontAwesomeModule} from "angular-font-awesome";
import {ColorPickerModule} from "ngx-color-picker";
import { SvgLayoutService } from './Services/svg-layout/svg-layout.service';
import { DomService } from './Services/dom/dom.service';
@NgModule({
  declarations: [
    AppComponent,CanvasComponent,TextComponent,CanvasImageComponent,
    MainPanelComponent,
    SvgLayoutComponent,
    LeftToolbarComponent,
    LeftToolbarDrawOptionsComponent,
    ImgSaverComponent,
    ColorPaletteComponent,
    ByParamsComponent
  ],
   entryComponents: [
    ImgSaverComponent,
    ColorPaletteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    ColorPickerModule
  ],
  providers: [
    HttpClient,
    Rest,
    SvgLayoutService,
    DomService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
