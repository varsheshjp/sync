import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'
import { Rest } from '../Services/rest.service';
import { HubConnection } from '@aspnet/signalr';
import { diff_match_patch } from 'src/js/diff_match_patch';
import { Time } from "@angular/common";
@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styles: ['canvas { border: 1px solid #000; }']
})
export class CanvasComponent implements AfterViewInit {
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
    public linewidth: number;
    public color: any;
    public colors = { 'red': '#ff0000', 'blue': '#0000ff', 'black': '#000000', 'green': '#00ff00' }
    constructor(private _rest: Rest) {
        this.ai = new diff_match_patch();
        this._rest.GetFile().subscribe((data) => {
            //JSON.stringify(myObj);
            var dtext = data[0];
            if (data[0] == "") {
                dtext = "[]";
            }
            this.shadowList = JSON.parse(dtext);
            this.drawingList = JSON.parse(dtext);
            this.serverChange();
        }, (error) => {
            console.log(error);
        });
        console.log("after error");
        this.hubConnection = this._rest.ConnectHub();
        this.hubConnection.on("PatchFromServer", (patch: string) => {
            if (patch == "") {
                this._rest.GetFile().subscribe((data) => {
                    //JSON.stringify(myObj);
                    var dtext = data[0];
                    if (data[0] == "") {
                        dtext = "[]";
                    }
                    this.shadowList = JSON.parse(dtext);
                    this.drawingList = JSON.parse(dtext);
                    this.serverChange();
                })
            }
            else {
                var shadowstring = JSON.stringify(this.shadowList);
                var mainstring = JSON.stringify(this.drawingList);
                var patches = this.ai.patch_fromText(patch);
                var s = this.ai.patch_apply(patches, shadowstring)[0];
                console.log(s);
                if (s == "") {
                    this.shadowList = JSON.parse("[]");
                }
                else {
                    this.shadowList = JSON.parse(s);
                }
                var m = this.ai.patch_apply(patches, mainstring)[0];
                if (m == "") {
                    this.drawingList = JSON.parse("[]");
                }
                else {
                    this.drawingList = JSON.parse(m);
                }

                this.serverChange();
            }
        })
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
    }
    private captureEvents(canvasEl: HTMLCanvasElement) {
        var leave = false;
        var tempList = []
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
                leave = true;
                const rect = canvasEl.getBoundingClientRect();
                const prevPos = [parseInt((res[0].clientX - rect.left).toString()), parseInt((res[0].clientY - rect.top).toString())];
                const currentPos = [parseInt((res[1].clientX - rect.left).toString()), parseInt((res[1].clientY - rect.top).toString())];
                tempList.push([prevPos, currentPos]);
                this.drawOnCanvas(prevPos, currentPos);
            });
        fromEvent(canvasEl, 'mouseup').subscribe(() => {
            this.drawingList.push({ line: tempList });
            console.log(JSON.stringify(this.drawingList).length);
            this.clientChange();
            tempList = [];
            leave = false;
        });
        fromEvent(canvasEl, 'mouseleave').subscribe(() => {
            if (leave) {
                this.drawingList.push({ line: tempList });
                this.clientChange();
                tempList = [];
                leave = false
            }
            else {
            }
        });
    }
    public undoMove() {
        this.cx.clearRect(0, 0, this.width, this.height);
        this.drawingList.pop();
        for (var a of this.drawingList) {
            for (var i of a['line']) {
                this.drawOnCanvas(i[0], i[1]);
            }
        }
        this.clientChange();
    }
    private drawOnCanvas(
        prevPos: number[],
        currentPos: number[]
    ) {
        if (!this.cx) { console.log('error at draw function'); return; }
        this.cx.beginPath();
        if (prevPos) {
            this.cx.moveTo(prevPos[0], prevPos[1]);
            this.cx.lineTo(currentPos[0], currentPos[1]);
            this.cx.stroke();
        }
    }
    private clientChange() {
        var shadowstring = JSON.stringify(this.shadowList);
        var mainstring = JSON.stringify(this.drawingList);

        if (shadowstring != mainstring) {
            var diff = this.ai.diff_main(shadowstring, mainstring)
            this.ai.diff_cleanupSemantic(diff)
            var patch = this.ai.patch_make(shadowstring, diff);
            patch = this.ai.patch_toText(patch);
            console.log(diff, patch);
            this.hubConnection.send("PatchFromClient", patch);
            this.shadowList = [];
            this.shadowList.push.apply(this.shadowList, this.drawingList);
        }
    }
    private serverChange() {
        this.cx.clearRect(0, 0, this.width, this.height);
        for (var a of this.drawingList) {
            for (var i of a['line']) {
                this.drawOnCanvas(i[0], i[1]);
            }
        }
    }
}