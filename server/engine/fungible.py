#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine import Account

MAX_BALANCE = 10 ** 10

class Fungible(object):
    def __init__(self, notify_hook = None):
        self.account = Account("0")
        self.balances = { "0": MAX_BALANCE }
        self.notify_hook = notify_hook

    def balance_of(self, account):
        if account._id in self.balances:
            return self.balances[account._id]
        else:
            return 0

    def transfer(self, _from, _to, value):
        if _from._id in self.balances and self.balances[_from._id] >= value:
            self.balances[_from._id] -= value
            if _to._id not in self.balances:
                self.balances[_to._id] = value
            else:
                self.balances[_to._id] += value
            if self.notify_hook:
                self.notify_hook(_from, _to, value)
            return True
        else:
            return False

    def set_notifier(self, notify_hook):
        self.notify_hook = notify_hook
