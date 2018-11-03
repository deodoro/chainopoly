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

class Game(object):
    INITIAL_BALANCE = 1500
    MAX_BALANCE = 1000000000
    MAX_PLAYERS = 6

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
        self.board = [None] * max([i.position + 1 for i in properties])
        # Emitindo os tokens não fungíveis
        self.properties = nonfungible.NonFungible()

        for p in properties:
            self.properties.mint(p._id, p.to_json())
            self.board[p.position] = p
        # Jogadores
        self.players = []
        self.accounts = {}
        # Estado inicial
        self.status = State.INIT
        self.cur_player = -1
        self._id = game_id
        self.ee = ee

    # O jogador se registra no jogo
    def register_player(self, account_id, alias = 'anon'):
        if len([i for i in self.players if account_id == i['account']]) == 0:
            account = Account(account_id)
            self.accounts[account_id] = account
            self.money.transfer(self.money.account, account, Game.INITIAL_BALANCE)
            player = {'account': account_id, 'alias': alias, 'position': 0}
            self.players.append(player)
            if self.ee:
                self.ee.emit('newplayer', game_id=self._id, player=player)
            return True
        else:
            return False

    # Lista de jogadores inscritos
    def list_players(self):
        return self.players

    # Lista as propriedades (na ordem do tabuleiro)
    def list_properties(self):
        return self.board

    def roll(self):
        if self.status < State.WAIT:
            self.cur_player += 1
            self.players[self.cur_player].position += randint(1,12)
            self.status = State.WAIT
