import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LoosePipe} from "./loose.pipe";
import {BytesPipe} from "./bytes.pipe";
import {FileSizePipe} from "./filesize.pipe";
import {StatePipe} from "./state.pipe";

@NgModule({
  declarations: [
    AppComponent,
    LoosePipe,
    BytesPipe,
    FileSizePipe,
    StatePipe
  ],
    imports: [
        BrowserModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
