import { Component } from "@angular/core";
import { Account, PendingInfo, GameService } from "../../components/services/game.service";
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
    private pending = {};
    private players: Account[] = [];

    static parameters = [GameService];
    constructor(private gameService: GameService) {
        this.data = {
            account: this.gameService.getAddress(),
            username: this.gameService.getName()
        };
        this.gameService.getPending().subscribe(pending => {
            this.pending = pending;
        });
        this.evtSubscription = this.gameService.on({
            transaction: data => {
                if (this.data.account == data.account) this.refreshBalance();
            },
            new_player: data => {
                this.players.push(data);
            }
        });
        this.refresh();
    }

    private refreshBalance = () =>
        this.gameService
            .getBalance()
            .subscribe(balance => this.balance = balance);

    private refreshPlayerList = () =>
        this.gameService
            .listPlayers()
            .subscribe(players => this.players = players);

    private refresh() {
        this.refreshBalance();
        this.refreshPlayerList();
    }

    decline() {
        this.gameService
            .decline()
            .subscribe(res => console.log(res));
    }

    private ranking() {
        return 0;
    }

    OnDestroy() {
        this.evtSubscription.unsubscribe();
    }

    ngAfterViewInit() {
        // Move up, default is to the bottom
        setTimeout(() => window.scroll(0, 0), 200);
    }
}
