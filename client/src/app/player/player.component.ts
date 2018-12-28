import { Component, ViewChild } from '@angular/core';
import { GameService } from '../../components/services/game.service';
import { BoardService } from '../../components/services/board.service';
import { NewsService } from '../../components/services/news.service';
import { NotificationPanelComponent } from '../../components/notification-panel/notification-panel.component';
import _ from 'lodash';

@Component({
    selector: 'player',
    templateUrl: './player.html',
    styleUrls: ['./player.scss'],
})
export class PlayerComponent {
    public data: any;
    public balance = 0;
    public properties = [];
    public gameStatus = 'init';
    public myTurn = false;
    public errorMessage = null;
    private ws = null;
    private transaction = { target: null, value: null};
    @ViewChild("errorDialog") errorDialog: NotificationPanelComponent;

    static parameters = [GameService, BoardService, NewsService];
    constructor(private gameService: GameService,
                private boardService: BoardService,
                private newsService: NewsService) {
        this.data = {
            username: localStorage.getItem("username"),
            account: localStorage.getItem("account")
        }
        this.gameService.getStatus().subscribe(status => this.gameStatus = status);
        this.gameService.on({
            'move': data => {
                        if (this.data.account == data.account) {
                            _.assign(this.data.player, data);
                            this.myTurn = true;
                        }
                        else
                            this.myTurn = false;
                    },
            'status': data => this.gameStatus = data
        })
        this.refreshPlayerInfo();
    }

    ngAfterViewInit() {
        this.gameService.getMyColor(this.gameService.getId(), this.data.account).subscribe(player => {
            this.data.player = _.omit(player, 'current');
            this.myTurn = player['current'];
        });
    }

    refreshPlayerInfo() {
        this.gameService.getBalance(this.gameService.getId(), this.data.account)
            .subscribe(balance => this.balance = balance);
        this.gameService.getProperties(this.gameService.getId(), this.data.account)
            .subscribe(properties => this.properties = properties);
    }

    roll() {
        this.gameService.roll()
            .subscribe(res => console.log(res));
    }

    transfer() {
        this.gameService.transfer(_.assign(this.transaction, {source: this.data.account}))
            .subscribe(success => {
                           this.transaction = { target: null, value: null};
                           this.newsService.Stream.emit(`${this.data.username} transferiu ${this.transaction.value} para a conta ${this.transaction.target}`);
                           this.refreshPlayerInfo();
                       },
                       error => {
                           this.errorMessage = error._body;
                           this.errorDialog.open();
                       });
    }

    cancel() {
        this.gameService.cancel(_.assign({source: this.data.account}))
            .subscribe(res => console.log(res));
    }

    commit() {
        this.gameService.commit(this.data.account)
            .subscribe(res => console.log(res));
    }

    showProperty(p) {
        this.boardService.getStream().emit({property: p});
    }

    OnDestroy() {
        this.ws.unsubscribe();
    }

}
