import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BoardComponent } from './board.component';
import { BoardService } from '../../components/services/board.service';

@NgModule({
    imports: [
        BrowserModule,
    ],
    declarations: [
        BoardComponent,
    ],
    providers: [
        BoardService,
    ],
    exports: [
        BoardComponent,
    ],
})
export class BoardModule {}
