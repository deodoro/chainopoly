#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine.entities import Account

MAX_BALANCE = 10 ** 10

class Fungible(object):
    def __init__(self):
        self.account = Account(0)
        self.balances = { 0: MAX_BALANCE }

    def balanceOf(self, account):
        if account._id in self.balances:
            return self.balances[account._id]
        else:
            return 0

    def transfer(self, _from, to, value):
        if _from._id in self.balances and self.balances[_from._id] >= value:
            self.balances[_from._id] -= value
            if to._id not in self.balances:
                self.balances[to._id] = value
            else:
                self.balances[to._id] += value
            dir(self.balances)
            return True
        else:
            return False
