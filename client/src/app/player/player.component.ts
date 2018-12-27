import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '../../components/services/player.service';
import { GameService } from '../../components/services/game.service';
import { SocketService } from '../../components/services/socket.service';
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
    public gameId = null;
    public gameStatus = 'init';
    public myTurn = false;
    public errorMessage = null;
    private ws = null;
    private transaction = { target: null, value: null};
    @ViewChild("errorDialog") errorDialog: NotificationPanelComponent;
    static parameters = [PlayerService, GameService, ActivatedRoute, SocketService, BoardService, NewsService];
    constructor(private service: PlayerService,
                private gameService: GameService,
                private route: ActivatedRoute,
                private socketService: SocketService,
                private boardService: BoardService,
                private newsService: NewsService) {
        this.gameId = this.route.snapshot.paramMap.get('id');
        this.data = {
            username: localStorage.getItem("username"),
            account: localStorage.getItem("account")
        }
        this.gameService.getStatus(this.gameId).subscribe(status => this.gameStatus = status);
        this.refreshPlayerInfo();
        this.ws = this.socketService.messages.subscribe(msg => {
            if (msg.payload.game_id == this.gameId) {
                switch(msg.type) {
                    case 'move':
                        if (this.data.account == msg.payload.player.account) {
                            _.assign(this.data.player, msg.payload.player);
                            this.boardService.getStream().emit({player: msg.payload.player});
                            this.myTurn = true;
                        }
                        else
                            this.myTurn = false;
                        break;
                    case 'status':
                        this.gameStatus = msg.payload.status;
                        break;
                }
            }
        });
    }

    ngAfterViewInit() {
        this.service.getMyColor(this.gameId, this.data.account).subscribe(player => {
            this.data.player = _.omit(player, 'current');
            this.boardService.getStream().emit({player: player});
            this.myTurn = player['current'];
        });
    }

    refreshPlayerInfo() {
        this.service.getBalance(this.gameId, this.data.account)
            .subscribe(balance => this.balance = balance);
        this.service.getProperties(this.gameId, this.data.account)
            .subscribe(properties => this.properties = properties);
    }

    roll() {
        this.gameService.roll(this.gameId)
            .subscribe(res => console.log(res));
    }

    transfer() {
        this.gameService.transfer(this.gameId, _.assign(this.transaction, {source: this.data.account}))
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
        this.gameService.cancel(this.gameId, _.assign({source: this.data.account}))
            .subscribe(res => console.log(res));
    }

    commit() {
        this.gameService.commit(this.gameId, this.data.account)
            .subscribe(res => console.log(res));
    }

    showProperty(p) {
        this.boardService.getStream().emit({property: p});
    }

    OnDestroy() {
        this.ws.unsubscribe();
    }

}
