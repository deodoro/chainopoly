#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine import emit

MAX_BALANCE = 10 ** 10

class Fungible(object):
    def __init__(self):
        self.account = "0"
        self.balances = { "0": MAX_BALANCE }

    def balance_of(self, account):
        if account in self.balances:
            return self.balances[account]
        else:
            return 0

    def transfer(self, _from, _to, value):
        if _from in self.balances and self.balances[_from] >= value:
            self.balances[_from] -= value
            if _to not in self.balances:
                self.balances[_to] = value
            else:
                self.balances[_to] += value
            emit('transaction', {'from': _from, 'to': _to, 'value': value})
            return True
        else:
            return False
