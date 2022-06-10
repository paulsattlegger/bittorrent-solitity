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
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {TrackerSettingsComponent} from './tracker-settings/tracker-settings.component';
import {MatTabsModule} from "@angular/material/tabs";
import {FormsModule} from "@angular/forms";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatButtonModule} from "@angular/material/button";
import {ToastrModule} from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    LoosePipe,
    BytesPipe,
    FileSizePipe,
    StatePipe,
    TorrentDetailComponent,
    TrackerDashboardComponent,
    TrackerSettingsComponent
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
    AppRoutingModule,
    MatSlideToggleModule,
    MatTabsModule,
    FormsModule,
    MatButtonToggleModule,
    MatButtonModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
