#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine import fungible, nonfungible
from engine.entities import *
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

    # Inicializando um jogo vazio
    def __init__(self, game_id, ee = None):
        # Carregando propriedades
        with open('engine/properties.json') as data_file:
            items = json.load(data_file)
            properties = [Property(name=i['name'],
                                   color=i['color'],
                                   price=i['price'],
                                   rent=i['rent'],
                                   position=i['position']) for i in items]
        # Token fungível
        self.money = fungible.Fungible()
        # As casas de um tabuleiro vazio
        self.board = [None] * max([i.position for i in properties])
        # Emitindo os tokens não fungíveis
        self.properties = nonfungible.NonFungible()

        for p in properties:
            self.properties.mint(p._id, p.to_json())
            self.board[p.position-1] = p
        # Estado Inicial
        self.players = []
        self.accounts = {}
        self.cur_player = -1
        self._id = game_id
        self.ee = ee
        self.set_status(State.INIT)

    def emit(self, type, **kwargs):
        if self.ee:
            self.ee.emit(type, game_id=self._id, **kwargs)

    # O jogador se registra no jogo
    def register_player(self, account_id, alias = 'anon'):
        if self.status == State.INIT and \
           len(self.players) < Game.MAX_PLAYERS and \
           not findOne(self.players, lambda p: p['account'] == account_id):
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
            if self.status == State.WAIT and self.players[self.cur_player]['account'] == account_id:
                return {**p, 'current': True}
            else:
                return {**p, 'current': False}
        return p

    def get_player_properties(self, account_id):
        return self.properties.what_owns(self.accounts[account_id])

    def get_player_balance(self, account_id):
        return self.money.balance_of(self.accounts[account_id])

    # Lista de jogadores inscritos
    def list_players(self):
        return self.players

    # Lista as propriedades (na ordem do tabuleiro)
    def list_properties(self):
        return self.board

    def roll(self):
        if self.status in [State.INIT, State.MOVE]:
            self.cur_player = (self.cur_player + 1) % len(self.players)
            self.players[self.cur_player]['position'] = \
                (self.players[self.cur_player]['position'] + randint(2,12)) % len(self.board)
            self.set_status(State.WAIT)
            self.emit('move', player=self.players[self.cur_player])

    def commit(self, account_id):
        if self.status == State.WAIT and account_id == self.players[self.cur_player]['account']:
            self.set_status(State.MOVE)

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
