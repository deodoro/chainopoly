import { Component, OnInit } from '@angular/core';
import { GameService } from "../../components/services/game.service";

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeaveComponent implements OnInit {

    private buttonDisabled: boolean = true;

    static parameters = [GameService];
    constructor(
        private gameService: GameService,
    ) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.buttonDisabled = false;
            console.log("toggle");
        }, 3000);
    }

    leaveGame() {
        console.dir("leave");
    }

}
