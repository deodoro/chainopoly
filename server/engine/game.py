#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine import Fungible, NonFungible, Account, Property, AtomicSwap
from enum import Enum
from random import randint
import json

class State(Enum):
    INIT = 0
    MOVE = 1
    WAIT = 2
    FINISHED = 3

def findOne(l, f):
    filtered = [i for i in l if f(i)]
    return filtered[0] if len(filtered) else None

class Game(object):
    INITIAL_BALANCE = 1500
    MAX_BALANCE = 1000000000
    MAX_PLAYERS = 6
    COLORS = ["blue", "red", "purple", "green", "orange", "darkturquoise"]
    PROPERTIES = None

    @staticmethod
    def get_properties():
        # Carregando propriedades
        if not Game.PROPERTIES:
            with open('assets/properties.json') as data_file:
                items = json.load(data_file)
                Game.PROPERTIES = [Property(name=i['name'],
                                       color=i['color'],
                                       price=i['price'],
                                       rent=i['rent'],
                                       position=i['position']) for i in items]
        return Game.PROPERTIES

    # Inicializando um jogo vazio
    def __init__(self, game_id, ee = None):
        # Tokens
        self.money = Fungible()
        self.properties = NonFungible()
        self.swap = AtomicSwap(self.money, self.properties)
        # Emissão de tokens e atribuição no tabuleiro
        self.board = [None] * (max([i.position for i in Game.get_properties()]) + 1)
        for p in Game.get_properties():
            self.properties.mint(p._id, p.to_json())
            self.board[p.position] = p
        # Estado Inicial
        self.players = []
        self.accounts = { self.properties.account._id: self.properties.account}
        self.cur_player_idx = -1
        self._id = game_id
        self.ee = ee
        self.set_status(State.INIT)
        self.check_pending = True

    def emit(self, type, **kwargs):
        if self.ee:
            self.ee.emit(type, game_id=self._id, **kwargs)

    # O jogador se registra no jogo
    def register_player(self, account_id, alias = 'anon'):
        if self.status == State.INIT and \
                len(self.players) < Game.MAX_PLAYERS and \
                account_id not in self.accounts:
            account = Account(account_id)
            self.accounts[account_id] = account
            self.money.transfer(self.money.account, account, Game.INITIAL_BALANCE)
            player = {'account': account_id, 'alias': alias, 'position': 0, 'color': Game.COLORS[len(self.players)]}
            self.players.append(player)
            self.emit('newplayer', player=player)
            return True
        else:
            return False

    # Lista de jogadores inscritos
    def get_player(self, account_id):
        p = findOne(self.players, lambda p: p['account'] == account_id)
        if p:
            return {**p, 'current': self.is_current(account_id)}
        return p

    def cur_player(self):
        return self.players[self.cur_player_idx]

    def is_current(self, account_id):
        return self.status == State.WAIT and self.cur_player()['account'] == account_id

    def get_player_properties(self, account_id):
        return [json.loads(self.properties.get_uri(i)) for i in self.properties.what_owns(self.accounts[account_id])]

    def get_player_balance(self, account_id):
        return self.money.balance_of(self.accounts[account_id])

    # Lista de jogadores inscritos
    def list_players(self):
        return self.players

    # Lista as propriedades (na ordem do tabuleiro)
    def list_properties(self):
        return self.board

    def get_player_action_expectation_by_account(self, account):
        return get_player_action_expectation(self, self.get_player(account_id))

    def get_player_action_expectation(self, player):
        if player == self.cur_player():
            prop = self.board[self.cur_player()['position']]
            if prop:
                owner = self.properties.who_owns(prop._id)
                if owner:
                    return {'player': player, 'info': {'action': 'rent', 'owner': self.get_player(owner._id), 'property': prop.to_dict()}}
                else:
                    return {'player': player, 'info': {'action': 'buy', 'property': prop.to_dict()}}
            else:
                return {'player': player, 'info': {'action': 'parking'}}
        else:
            return {'player': player, 'info': {'action': 'wait', 'current': self.cur_player()}}

    def update_player_position(self, dice):
        if self.status in [State.INIT, State.MOVE]:
            self.cur_player_idx = (self.cur_player_idx + 1) % len(self.players)
            self.cur_player()['position'] = \
                (self.cur_player()['position'] + (dice if dice else randint(2,12))) % len(self.board)
            self.set_status(State.WAIT)
            self.emit('move', player=self.cur_player())
            return True
        else:
            return False

    def prepare_player_action(self):
        action = self.get_player_action_expectation(self.cur_player())
        if action['info']['action'] == 'buy':
           self.swap.add_iofferu(self.accounts[action['player']['account']], action['info']['property']['id'], action['info']['property']['price'])
        elif action['info']['action'] == 'rent':
           self.swap.add_iou(self.accounts[action['info']['owner']['account']], self.accounts[action['player']['account']], action['info']['property']['rent'])
        self.emit('action', **action)

    def roll(self, dice = None):
        if self.update_player_position(dice):
            self.prepare_player_action()

    def commit(self, account_id):
        if self.status == State.WAIT and account_id == self.cur_player()['account'] and not (self.check_pending and self.swap.has_pending(self.accounts[account_id])):
            self.set_status(State.MOVE)
            return True
        else:
            return False

    def get_status(self):
        if self.status == State.INIT:
            return 'init'
        elif self.status == State.WAIT:
            return 'wait'
        elif self.status == State.MOVE:
            return 'move'
        elif self.status == State.FINISHED:
            return 'finished'
        else:
            return 'invalid'

    def set_status(self, status):
        self.status = status
        self.emit('status', status=self.get_status())

    def set_check_pending(self, value):
        self.check_pending = value
