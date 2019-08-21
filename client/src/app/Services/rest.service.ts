import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';

import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest, HttpClient, HttpHeaders
} from '@angular/common/http';

let Path:string="http://10.1.82.95:5000/";
@Injectable({
    providedIn: 'root'
})
export class Rest{
    hubConnection:HubConnection;
    isConnected:boolean;
    constructor(private _http:HttpClient){
        this.isConnected=true;
    }
    GetFile(): Observable<string>{
        return this._http.get<string>(Path+"api/values/file");
    }
    SendFile(obj:string):Observable<string>{
        return this._http.put<string>(Path+"api/values/fileUp",obj);
    }
    ConnectHub():HubConnection{
        this.hubConnection=new signalR.HubConnectionBuilder()
            .withUrl(Path+'Hub')
            .build();
        this.isConnected=true;
        this.hubConnection.start().catch(err => {this.isConnected=false;console.log("we are comming here but no effect ",this.isConnected);});
        console.log(this.isConnected);
        return this.hubConnection;
    }
}