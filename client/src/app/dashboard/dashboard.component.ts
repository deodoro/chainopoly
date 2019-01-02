import { Component } from "@angular/core";
import { GameService } from "../../components/services/game.service";
import _ from "lodash";

@Component({
    selector: "dashboard",
    templateUrl: "./dashboard.html",
    styleUrls: ["./dashboard.scss"]
})
export class DashboardComponent {
    private transaction = { target: null, value: null };
    private evtSubscription;
    public data;
    public balance = 0;
    public properties = 0;
    public errorMessage = null;
    private pending = {
        rent: [
            {
                src: {
                    account: "0xf5ac0452ed4ebb92d67e169beaa81d7d3b5a7ccb",
                    alias: "Alias"
                },
                dst: {
                    account: "0x1234567890123456789012345678901234567890",
                    alias: "Other"
                },
                value: 10,
                property: {
                    token: 1,
                    name: "Wall St.",
                }
            },
            {
                src: {
                    account: "0x1234567890123456789012345678901234567890",
                    alias: "Alias"
                },
                dst: {
                    account: "0x1234567890123456789012345678901234567890",
                    alias: "Other"
                },
                value: 10,
                property: {
                    token: 1,
                    name: "Wall St.",
                }
            }
        ],
        offer: [
            {
                property: {
                    token: 1,
                    name: "Wall St.",
                },
                value: 10,
                to: {
                    account: "0xf5ac0452ed4ebb92d67e169beaa81d7d3b5a7ccb",
                    alias: "Other"
                }
            },
            {
                property: {
                    token: 1,
                    name: "Wall St.",
                },
                value: 10,
                to: {
                    account: "0x1234567890123456789012345678901234567890",
                    alias: "Other"
                }
            }
        ]
    };

    static parameters = [GameService];
    constructor(
        private gameService: GameService,
    ) {
        this.data = {
            account: this.gameService.getAddress(),
            username: this.gameService.getName()
        };
        // this.evtSubscription = this.gameService.on({
        //     move: data => {
        //         if (this.data.account == data.account) {
        //             _.assign(this.data.player, data);
        //             this.myTurn = true;
        //         } else this.myTurn = false;
        //     },
        //     status: data => (this.gameStatus = data)
        // });
        this.refreshPlayerInfo();

        // let myAccount = this.gameService.getAddress();
        // this.gameService.listPlayers().subscribe(players => {
        //     players.forEach(p => this.gameService.emit("move", p));
        //     this.players = players.filter(i => i.account != myAccount);
        // });
        // this.evtSubscription = this.gameService.on({
        //     move: data =>
        //         this.players
        //             .filter(p => p.account == data.account)
        //             .forEach(p => _.assign(p, data)),
        //     status: data => (this.gameState = data),
        //     new_player: data => {
        //         this.players.push(data);
        //         this.gameService.emit("move", data);
        //     }
        // });
    }

    ngAfterViewInit() {
        setTimeout(() => window.scroll(0,0), 200);
    }

    refreshPlayerInfo() {
        this.gameService
            .getBalance(this.data.account)
            .subscribe(balance => (this.balance = balance));
        // this.gameService
        //     .getProperties(this.data.account)
        //     .subscribe(properties => (this.properties = properties));
    }

    roll() {
        this.gameService.roll().subscribe(res => console.log(res));
    }

    transfer() {
        this.gameService
            .transfer(_.assign(this.transaction, { source: this.data.account }))
            .subscribe(
                success => {
                    this.transaction = { target: null, value: null };
                    this.refreshPlayerInfo();
                },
                error => {
                    this.errorMessage = error._body;
                    // this.errorDialog.open();
                }
            );
    }

    decline() {
        this.gameService
            .decline(_.assign({ source: this.data.account }))
            .subscribe(res => console.log(res));
    }

    commit() {
        this.gameService
            .commit(this.data.account)
            .subscribe(res => console.log(res));
    }

    showProperty(p) {
        console.dir(p);
    }

    OnDestroy() {
        this.evtSubscription.unsubscribe();
    }
}
