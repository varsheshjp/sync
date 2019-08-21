import { Component } from '@angular/core';
import {diff_match_patch } from 'src/js/diff_match_patch'
import { Rest } from './Services/rest.service';
import { HubConnection } from '@aspnet/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
}
