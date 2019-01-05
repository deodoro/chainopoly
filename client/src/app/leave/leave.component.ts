import { Component, OnInit } from "@angular/core";
import { PlayerService } from "../../components/services/player.service";
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

    static parameters = [PlayerService, Router];
    constructor(private playerService: PlayerService, private router: Router) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.buttonDisabled = false;
        }, 3000);
    }

    leaveGame() {
        this.playerService.unregister().subscribe(r => {
            this.router.navigateByUrl("/start");
        });
    }
}
