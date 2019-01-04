import { Component, OnInit } from "@angular/core";
import { GameService } from "../../components/services/game.service";
import { Router } from "@angular/router";
import _ from "lodash";

@Component({
    selector: "app-leave",
    templateUrl: "./leave.component.html",
    styleUrls: ["./leave.component.scss"]
})
export class LeaveComponent implements OnInit {
    private buttonDisabled: boolean = true;
    private balance: number;
    private propertyBalance: number;

    static parameters = [GameService, Router];
    constructor(private gameService: GameService, private router: Router) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.buttonDisabled = false;
        }, 3000);
    }

    leaveGame() {
        this.gameService.unregister().subscribe(r => {
            this.router.navigateByUrl("/start");
        });
    }
}
