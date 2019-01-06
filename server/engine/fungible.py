#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine import emit
from datetime import datetime

MAX_BALANCE = 10 ** 10

class Fungible(object):
    def __init__(self):
        self.account = "0"
        self.balances = { "0": MAX_BALANCE }
        self.history = []

    def balance_of(self, account):
        if account in self.balances:
            return self.balances[account]
        else:
            return 0

    def transfer(self, _from, _to, value):
        if _from != _to and _from in self.balances and self.balances[_from] >= value:
            self.history.append((datetime.now().isoformat(), _from, _to, value))
            self.balances[_from] -= value
            if _to not in self.balances:
                self.balances[_to] = value
            else:
                self.balances[_to] += value
            emit('transaction', {'from': _from, 'to': _to, 'value': value})
            return True
        else:
            return False

    def get_history(self, account):
        return [dict(zip(['date', '_from', '_to', 'value'], i)) for i in self.history if i[1] == account or i[2] == account]
