import { NgModule } from '@angular/core';
import { BoardService } from './board.service';
import { BoardRESTService } from './board.mock.service';
import { BoardWeb3Service } from './board.w3.service';

@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [
    { provide: BoardService, useClass: BoardWeb3Service },
  ],
})
export class ServicesModule { }
