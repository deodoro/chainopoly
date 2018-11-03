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

    # Inicializando um jogo vazio
    def __init__(self):
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
        # Estado inicial
        self.status = State.INIT
        self.cur_player = -1

    # O jogador que se registra recebe INITIAL_BALANCE de créditos
    def register_account(self, account):
        if account._id not in players and self.money.transfer(self.money.account, account, Game.INITIAL_BALANCE):
            self.players.append({'account': account, position: 0})
            return True
        return False

    # Lista as propriedades (na ordem do tabuleiro)
    def list_properties(self):
        return self.board

    def roll(self):
        if self.status < State.WAIT:
            self.cur_player += 1
            self.players[self.cur_player].position += randint(1,12)
            self.status = State.WAIT
