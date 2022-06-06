import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LoosePipe} from "./loose.pipe";
import {BytesPipe} from "./bytes.pipe";
import {FileSizePipe} from "./filesize.pipe";
import {StatePipe} from "./state.pipe";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {TorrentDetailComponent} from './torrent-detail/torrent-detail.component';
import {TrackerDashboardComponent} from './tracker-dashboard/tracker-dashboard.component';
import {MatInputModule} from "@angular/material/input";
import {AppRoutingModule} from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LoosePipe,
    BytesPipe,
    FileSizePipe,
    StatePipe,
    TorrentDetailComponent,
    TrackerDashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatListModule,
    MatInputModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
