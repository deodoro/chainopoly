#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine import Fungible, NonFungible, Property, AtomicSwap, EventEmitterSingleton, emit
from enum import Enum
from random import randint
import json

def findOne(l, f):
    filtered = [i for i in l if f(i)]
    return filtered[0] if len(filtered) else None

class Game(object):
    INITIAL_BALANCE = 1500
    MAX_BALANCE = 1000000000
    MAX_PLAYERS = 6
    PROPERTIES = None

    @staticmethod
    def get_properties():
        # Carregando propriedades
        if not Game.PROPERTIES:
            with open('assets/lotr.json') as data_file:
                items = json.load(data_file)
                Game.PROPERTIES = [Property(name=i['name'],
                                       color=i['color'],
                                       price=i['price'],
                                       rent=i['rent'],
                                       position=i['position'],
                                       geo=i['geo']) for i in items]
        return Game.PROPERTIES

    # Game init
    def __init__(self):
        # Tokens
        self.money = Fungible()
        self.properties = NonFungible()
        self.swap = AtomicSwap(self.money, self.properties)
        # Loading board
        self.board = [None] * (max([i.position for i in Game.get_properties()]) + 1)
        for p in Game.get_properties():
            self.properties.mint(p._id, p.to_json())
            self.board[p.position] = p
        # Initial state
        self.players = []
        self.accounts = [ self.properties.account ]
        self.round = 0
        # Event handling
        EventEmitterSingleton.instance().on('match', lambda t: self.check_round_finished())

    # May a new player join the game?
    def new_player_allowed(self, account):
        return len(self.players) < Game.MAX_PLAYERS and account not in self.accounts

    # A player registers
    def register_player(self, account, alias):
        if self.new_player_allowed(account):
            self.accounts.append(account)
            self.money.transfer(self.money.account, account, Game.INITIAL_BALANCE)
            self.players.append({'account': account, 'alias': alias, 'position': 0})
            emit('newplayer', {'player': self.players[-1] })
            if len(self.players) == 2:
                self.execute_round()
            else:
                if len(self.players) > 2 and self.round < 2:
                    self.roll(self.players[-1])
        else:
            raise Exception("Invalid registration")

    def execute_round(self):
        self.round += 1
        emit('newround', {'round': self.round})
        for player in self.players:
            self.roll(player)

    def roll(self, player):
        player['position'] = (player['position'] + randint(2,12)) % len(self.board)
        self.prepare_player_action(player)

    # Gets a player info by account
    def get_player(self, account):
        p = findOne(self.players, lambda p: p['account'] == account)
        if p:
            return {**p}
        else:
            return None

    # Reads player's unfungible tokens
    def get_player_properties(self, account):
        return [json.loads(self.properties.get_uri(i)) for i in self.properties.what_owns(account)]

    # Reads player's fungible token balance
    def get_player_balance(self, account):
        return self.money.balance_of(account)

    # Lists registered players
    def list_players(self):
        return self.players

    # List all properties
    def list_properties(self):
        return self.board

    def get_player_action_expectation(self, player):
        prop = self.board[player['position']]
        if prop:
            owner = self.properties.who_owns(prop._id)
            if owner:
                return {'type': 'rent', 'owner': self.get_player(owner), 'property': prop.to_dict()}
            elif not any([p for p in self.players if p['account'] != player['account'] and p['position'] == player['position']]):
                return {'type': 'offer', 'property': prop.to_dict()}
        else:
            return None

    def prepare_player_action(self, player):
        action = self.get_player_action_expectation(player)
        if action:
            if action['type'] == 'offer':
               self.swap.add_offer(player['account'], action['property']['id'], action['property']['price'])
            elif action['type'] == 'rent':
               self.swap.add_invoice(action['owner']['account'], player['account'], action['property']['rent'])
            action['from'] = player
            emit('action', action)

    def check_round_finished(self):
        if not self.swap.pending():
            self.execute_round()
