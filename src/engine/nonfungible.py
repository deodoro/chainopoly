#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine.entities import Account

class NonFungible(object):
    def __init__(self):
        self.account = Account(0)
        self.ownership = {self.account._id: []}
        self.ownership_reverse = {}
        self.tokenUris = {}
        self.pending = []

    def check_ownership_for_account(self, account):
        if account._id not in self.ownership:
            self.ownership[account._id] = []

    def mint(self, id, uri = None):
        if id not in self.ownership_reverse:
            self.ownership[self.account._id].append(id)
            self.ownership_reverse[id] = self.account
            self.set_uri(id, uri)
            return True
        else:
            return False

    def set_uri(self, id, uri):
        if uri:
            self.tokenUris[id] = uri

    def get_uri(self, id):
        return self.tokenUris[id] if id in self.tokenUris else None

    # Transfere de um indivíduo para outro
    def transfer(self, _to, id):
        if id in self.ownership_reverse:
            self.pending.append((self.ownership_reverse[id], _to,id))
            return True
        else:
            return False

    def confirm(self, _to, id):
        if id in self.ownership_reverse:
            _from = self.ownership_reverse[id]
            if (_from, _to, id) in self.pending:
                self.check_ownership_for_account(_to)
                self.ownership[_from._id].remove(id)
                self.ownership[_to._id].append(id)
                self.ownership_reverse[id] = _to
                return True
        return False

    # Quem é dono dessa propriedade?
    def who_owns(self, id):
        return self.ownership_reverse[id] if id in self.ownership_reverse else None

    # Que propriedades esse jogador possui?
    def what_owns(self, account):
        return self.ownership[account._id] if account._id in self.ownership else []
