import { NgModule } from '@angular/core';
import { BoardComponent } from './board.component';
import { BoardService } from '../../components/services/board.service';

@NgModule({
    imports: [
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
