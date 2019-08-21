import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'
import { Rest } from '../Services/rest.service';
import { HubConnection } from '@aspnet/signalr';
import { diff_match_patch } from 'src/js/diff_match_patch';
@Component({
    selector: 'app-canvas_image',
    templateUrl: './canvasImage.component.html',
    styles: ['canvas { border: 1px solid #000; }']
})
export class CanvasImageComponent implements AfterViewInit {
    ai: diff_match_patch;
    hubConnection: HubConnection;
    // a reference to the canvas element from our template
    @ViewChild('canvas') public canvas: ElementRef;
    // setting a width and height for the canvas
    @Input() public width = 400;
    @Input() public height = 400;
    private cx: CanvasRenderingContext2D;
    private drawingList: any = [];
    private shadowList: any = [];
    private sImage:any;
    private dImage:any;
    constructor(private _rest: Rest) {
    }
    public ngAfterViewInit() {
        const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
        this.cx = canvasEl.getContext('2d');
        canvasEl.width = this.width;
        canvasEl.height = this.height;
        this.cx.lineWidth = 3;
        this.cx.lineCap = 'round';
        this.cx.strokeStyle = '#000';
        this.captureEvents(canvasEl);
        this.ai = new diff_match_patch();
        this._rest.GetFile().subscribe((data) => {
            console.log(data[0]);
            if(data[0]==null){
                var b=this.cx.getImageData(0,0,this.width,this.height)
                var val:string=JSON.stringify(b);
                console.log(b);
                console.log(val);
                var obj ={0:0,1:1}
                console.log(JSON.stringify(obj))
                var d=JSON.stringify(obj)
                console.log(JSON.parse(d));
                this._rest.SendFile(val).subscribe((data)=>{
                    this.dImage=this.cx.getImageData(0,0,this.width,this.height);
                    this.sImage=this.cx.getImageData(0,0,this.width,this.height);
                    console.log("data uploaded");
                });
            }
            else{
                this.sImage = JSON.parse(data[0]);
                this.dImage = JSON.parse(data[0]);
            }
            console.log(this.dImage);
        })
        this.hubConnection = this._rest.ConnectHub();
        this.hubConnection.on("PatchFromServer", (patch: string) => {
            var patches = this.ai.patch_fromText(patch);
            var map= this.ai.patch_fromText(patch[0]);
            this.sImage = JSON.parse(this.ai.patch_apply(patches, JSON.parse(this.sImage))[0]);
            this.dImage = JSON.parse(this.ai.patch_apply(patches, JSON.parse(this.dImage))[0]);
            this.serverChange();
            console.log(map);
        })
        this.hubConnection.onclose(() => {
            setTimeout(function () {
                this.hubConnection=this._rest.ConnectHub();
            }, 3000);
        });
    }
    private captureEvents(canvasEl: HTMLCanvasElement) {
        fromEvent(canvasEl, 'mousedown')
            .pipe(
            switchMap((e) => {
                return fromEvent(canvasEl, 'mousemove')
                    .pipe(
                    takeUntil(fromEvent(canvasEl, 'mouseup')),
                    takeUntil(fromEvent(canvasEl, 'mouseleave')),
                    pairwise()
                    )
            })
            )
            .subscribe((res: [MouseEvent, MouseEvent]) => {
                const rect = canvasEl.getBoundingClientRect();
                const prevPos = {
                    x: parseInt((res[0].clientX - rect.left).toString()),
                    y: parseInt((res[0].clientY - rect.top).toString())
                };

                const currentPos = {
                    x: parseInt((res[1].clientX - rect.left).toString()),
                    y: parseInt((res[1].clientY - rect.top).toString())
                };
                if(Math.abs(prevPos['x']-currentPos['x'])<1 && Math.abs(prevPos['y']-currentPos['y'])<1){
                    console.log("got!!!");
                }
                else{
                     this.drawOnCanvas(prevPos, currentPos);
                }
            });
        fromEvent(canvasEl, 'mouseup').subscribe(() => {
            this.clientChange();
        });
    }
    private drawOnCanvas(
        prevPos: { x: number, y: number },
        currentPos: { x: number, y: number }
    ) {
        if (!this.cx) { console.log('error at draw function'); return; }

        this.cx.beginPath();
        if (prevPos) {
            this.cx.moveTo(prevPos.x, prevPos.y); 
            this.cx.lineTo(currentPos.x, currentPos.y);
            this.cx.stroke();
        }
    }
    private clientChange() {
        this.dImage=this.cx.getImageData(0, 0, this.width, this.height);
        var diff = this.ai.diff_main(JSON.stringify(this.sImage),JSON.stringify(this.dImage))
        this.ai.diff_cleanupSemantic(diff)

        var patch = this.ai.patch_make(JSON.stringify(this.sImage), diff);

        patch = this.ai.patch_toText(patch);

        this.hubConnection.send("PatchFromClient", patch);
        this.sImage=this.dImage;
    }
    private serverChange() {
        this.cx.putImageData(this.dImage,0,0);
    }
}