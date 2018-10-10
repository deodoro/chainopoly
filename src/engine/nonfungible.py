#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from entities import Account

def first(array):
    return array[0] if array else None

class NonFungible(object):
    # Inicializando um jogo vazio
    # PS: conta 0 é do banco, e recebe o saldo máximo possível
    def __init__(self):
        self.account = Account(0)
        self.ownership = {}
        self.ownership_reverse = {}
        self.tokenUris = {}

    def check_ownership_for_account(self, account):
        if account.id not in self.ownership:
            self.ownership[account.id] = []

    def mint(self, id):
        self.ownership[self.account.id].append(id)
        self.ownership_reverse[id] = self.account.id

    def set_uri(self, id, uri)
        self.tokenUris[id] = uri

    def get_uri(self, id):
        return self.tokenUris[id]

    # Transfere de um indivíduo para outro
    def transfer(self,  _from, _to, id):
        if id in self.ownership[_from.id]:
            check_ownership_for_account(_to.id)
            self.ownership[_from.id].remove(id)
            self.ownership[_to.id].append(id)
            return True
        else:
            return False

    # Quem é dono dessa propriedade?
    def who_owns(self, id):
        return self.ownership_reverse[id]

    # Que propriedades esse jogador possui?
    def what_owns(self, account):
        return self.ownership[account.id]
