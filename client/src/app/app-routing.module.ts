import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanvasComponent } from './Canvas/canvas.component';
import { TextComponent } from './Text/text.component';
import { CanvasImageComponent } from './CanvasImage/canvasImage.component';
import { SvgLayoutComponent } from './svg-layout/svg-layout.component';

const routes: Routes = [
  { path: '', component:CanvasComponent },
  { path: 'text', component:TextComponent},
  { path: 'canvasImage' ,component:CanvasImageComponent},
  { path:'svg', component:SvgLayoutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
