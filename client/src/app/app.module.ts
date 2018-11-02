import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BoardModule } from './board/board.module';
import { PanelModule } from './panel/panel.module';
import { StartModule } from './start/start.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BoardModule,
    PanelModule,
    StartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
