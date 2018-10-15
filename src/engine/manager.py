#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine import fungible, nonfungible
from engine.entities import *
from enum import Enum
from random import randint

class State(Enum):
    INIT = 0
    MOVE = 1
    WAIT = 2
    FINISHED = 3

class Manager(object):
    PROPERTIES = [
        Property(name='Mediterranean Ave.', color='purple', price=60, rent=2, position=2),
        Property(name='Baltic Ave.', color='purple', price=60, rent=4, position=4),
        Property(name='Oriental Ave.', color='lightblue', price=100, rent=6, position=7),
        Property(name='Vermont Ave.', color='lightblue', price=100, rent=6, position=9),
        Property(name='Connecticut Ave.', color='lightblue', price=120, rent=8, position=10),
        Property(name='St. Charles Place', color='violet', price=140, rent=10, position=12),
        Property(name='States Ave.', color='violet', price=140, rent=10, position=14),
        Property(name='Virginia Ave.', color='violet', price=160, rent=12, position=15),
        Property(name='St. James Place', color='orange', price=180, rent=14, position=17),
        Property(name='Tennessee Ave.', color='orange', price=180, rent=14, position=19),
        Property(name='New York Ave.', color='orange', price=200, rent=16, position=20),
        Property(name='Kentucky Ave.', color='red', price=220, rent=18, position=22),
        Property(name='Indiana Ave.', color='red', price=220, rent=18, position=24),
        Property(name='Illinois Ave.', color='red', price=240, rent=20, position=25),
        Property(name='Atlantic Ave.', color='yellow', price=260, rent=22, position=27),
        Property(name='Ventnor Ave.', color='yellow', price=260, rent=22, position=28),
        Property(name='Marvin Gardens', color='yellow', price=280, rent=24, position=30),
        Property(name='Pacific Ave.', color='darkgreen', price=300, rent=26, position=32),
        Property(name='North Carolina Ave.', color='darkgreen', price=300, rent=26, position=33),
        Property(name='Pennsylvania Ave.', color='darkgreen', price=320, rent=28, position=35),
        Property(name='Park Place', color='darkblue', price=350, rent=35, position=38),
        Property(name='Boardwalk', color='darkblue', price=400, rent=50, position=40),
        Property(name='Electric Company', color='utility', price=150, rent=0, position=13),
        Property(name='Water Works', color='utility', price=150, rent=0, position=29),
        Property(name='Reading Railroad', color='utility', price=200, rent=1, position=6),
        Property(name='Pennsylvania Railroad', color='utility', price=200, rent=1, position=16),
        Property(name='B. & O. Railroad', color='utility', price=200, rent=1, position=26),
        Property(name='Short Line Railroad', color='utility', price=200, rent=1, position=36)
    ]
    INITIAL_BALANCE = 1500
    MAX_BALANCE = 1000000000

    # Inicializando um jogo vazio
    def __init__(self):
        # Token fungível
        self.money = fungible.Fungible()
        # As casas de um tabuleiro vazio
        self.board = [None] * max([i.position + 1 for i in Manager.PROPERTIES])
        # Emitindo os tokens não fungíveis
        self.properties = nonfungible.NonFungible()
        for p in Manager.PROPERTIES:
            self.properties.mint(p._id, p.to_json())
            self.board[p.position] = p
        # Jogadores
        self.players = []
        # Estado inicial
        self.status = State.INIT
        self.cur_player = -1

    # O jogador que se registra recebe INITIAL_BALANCE de créditos
    def register_account(self, account):
        if account._id not in players and self.money.transfer(self.money.account, account, Manager.INITIAL_BALANCE):
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
