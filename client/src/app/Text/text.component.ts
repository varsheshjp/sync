
import { HubConnection } from '@aspnet/signalr';
import { diff_match_patch } from 'src/js/diff_match_patch';
import { Rest } from '../Services/rest.service';
import {Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-canvas',
    template:'<textarea [(ngModel)]="text" (keyup)="onKeydown()"></textarea>',
})
export class TextComponent{
    shadow:string;
  text:string;
  extra:string;
  ai:diff_match_patch;
  hubConnection:HubConnection;
  constructor(private _rest:Rest){
    this.ai=new diff_match_patch();
    this._rest.GetFile().subscribe((data)=>{
      this.shadow=data[0];
      this.text=this.shadow;
      this.extra=this.shadow;
    })
    this.hubConnection=this._rest.ConnectHub();
    this.hubConnection.on("PatchFromServer",(patch:string)=>{
      console.log(patch);
      var patches=this.ai.patch_fromText(patch);
      this.shadow=this.ai.patch_apply(patches, this.shadow)[0];
      this.text=this.ai.patch_apply(patches, this.text)[0];
    })
  }
  onKeydown(){
    if(this.shadow!=this.text){
      var diff=this.ai.diff_main(this.shadow, this.text)
      this.ai.diff_cleanupSemantic(diff)
      console.log('diff',diff);
      var patch=this.ai.patch_make(this.shadow, diff);
      patch=this.ai.patch_toText(patch);
      console.log(patch);
      this.hubConnection.send("PatchFromClient",patch);
      this.shadow=this.text;     
    }
  }
}