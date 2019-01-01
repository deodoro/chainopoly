import { Component, ViewChild } from "@angular/core";
import { GameService } from "../../components/services/game.service";
import { NewsService } from "../../components/services/news.service";
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
    public properties = [];
    public gameStatus = "init";
    public myTurn = false;
    public errorMessage = null;

    static parameters = [GameService, NewsService];
    constructor(
        private gameService: GameService,
        private newsService: NewsService
    ) {
        this.data = {
            account: this.gameService.getAddress(),
            username: this.gameService.getName()
        };
        this.evtSubscription = this.gameService.on({
            move: data => {
                if (this.data.account == data.account) {
                    _.assign(this.data.player, data);
                    this.myTurn = true;
                } else this.myTurn = false;
            },
            status: data => (this.gameStatus = data)
        });
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
        this.gameService
            .getMyColor(this.data.account)
            .subscribe(player => {
                this.data.player = _.omit(player, "current");
                this.myTurn = player["current"];
            });
    }

    refreshPlayerInfo() {
        this.gameService
            .getBalance(this.data.account)
            .subscribe(balance => (this.balance = balance));
        this.gameService
            .getProperties(this.data.account)
            .subscribe(properties => (this.properties = properties));
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
                    this.newsService.Stream.emit(
                        `${this.data.username} transferiu ${
                            this.transaction.value
                        } para a conta ${this.transaction.target}`
                    );
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
