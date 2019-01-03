#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine import Fungible, NonFungible, EventEmitterSingleton, emit

class AtomicSwap:
    def __init__(self, fungible, nonfungible):
        self.fungible = fungible
        self.nonfungible = nonfungible
        self.pending_fungible = []
        self.pending_nonfungible = []
        self.last_id = 0
        EventEmitterSingleton.instance().on('transaction', lambda t: self.match_transaction(t['from'], t['to'], t['value']))

    def add_invoice(self, debitor, token, value):
        creditor = self.nonfungible.who_owns(token)
        print(creditor)
        assert creditor
        self.pending_fungible.append({"creditor": creditor, "debitor": debitor, "token": token, "value": value, "id": self.last_id})
        self.last_id += 1
        return True

    def add_offer(self, debitor, token, value):
        if self.nonfungible.transfer(debitor, token):
            creditor = self.nonfungible.who_owns(token) or self.nonfungible.account
            self.pending_nonfungible.append({"creditor": creditor, "debitor": debitor, "token": token, "value": value, "id": self.last_id})
            self.last_id += 1
            return True
        else:
            return False

    def match_transaction(self, _from, _to, value):
        for t in self.pending_fungible:
            if t["creditor"] == _to and t["debitor"] == _from and t["value"] == value:
                self.pending_fungible.remove(t)
                emit('match', {'id': t['id']})
                return
        for t in self.pending_nonfungible:
            if t["creditor"] == _to and t["debitor"] == _from and t["value"] == value:
                self.pending_nonfungible.remove(t)
                self.nonfungible.confirm(t['debitor'], t['token'])
                emit('match', {'id': t['id']})
                return

    def cancel_offer(self, token = None, debitor = None):
        for t in self.pending_nonfungible:
            if (token and t["token"] == token) or (debitor and t["debitor"] == debitor):
                self.pending_nonfungible.remove(t)
                self.nonfungible.cancel(t['debitor'], t['token'])
                return True
        return False

    def has_pending(self, account):
        return len([i for i in self.pending_fungible if i["debitor"] == account]) > 0 or \
               len([i for i in self.pending_nonfungible if i["debitor"] == account]) > 0

    def pending(self):
        return len(self.pending_fungible) > 0 or len(self.pending_nonfungible) > 0
