#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine import Fungible, NonFungible, EventEmitterSingleton, emit

class AtomicSwap:
    def __init__(self, fungible, nonfungible):
        self.fungible = fungible
        self.nonfungible = nonfungible
        self.pending_invoices = []
        self.pending_offers = []
        self.last_id = 0
        EventEmitterSingleton.instance().on('transaction', lambda t: self.match_transaction(t['_from'], t['_to'], t['value']))

    def add_invoice(self, _from, token, value):
        _to = self.nonfungible.who_owns(token)
        assert _to
        self.last_id += 1
        record = {"_from": _from, "_to": _to, "token": token, "value": value, "id": self.last_id}
        self.pending_invoices.append(record)
        emit('invoice', record)

    def add_offer(self, _to, token, value):
        assert self.nonfungible.transfer(_to, token)
        _from = self.nonfungible.who_owns(token) or self.nonfungible.account
        self.last_id += 1
        record = {"_from": _from, "_to": _to, "token": token, "value": value, "id": self.last_id}
        self.pending_offers.append(record)
        emit('offer', record)

    def match_transaction(self, _from, _to, value):
        for t in self.pending_invoices:
            if t["_from"] == _from and t["_to"] == _to and t["value"] == value:
                self.pending_invoices.remove(t)
                emit('match', {'id': t['id']})
                return
        for t in self.pending_offers:
            if t["_from"] == _to and t["_to"] == _from and t["value"] == value:
                self.pending_offers.remove(t)
                self.nonfungible.confirm(t['_to'], t['token'])
                emit('match', {'id': t['id']})
                return

    def reject(self, token = None, _to = None):
        for t in self.pending_offers:
            if (token and t["token"] == token) or (_to and t["_to"] == _to):
                self.pending_offers.remove(t)
                self.nonfungible.cancel(t['_to'], t['token'])
                emit('match', {'id': t['id']})
                return True
        return False

    def has_pending(self, account):
        return len([i for i in self.pending_invoices if i["_from"] == account]) > 0 or \
               len([i for i in self.pending_offers if i["_to"] == account]) > 0

    def pending(self):
        return len(self.pending_invoices) > 0 or len(self.pending_offers) > 0

    def get_pending(self):
        def with_type(type):
            return lambda i: {'type': type, **i}
        return list(map(with_type('offer'), self.pending_offers)) + \
               list(map(with_type('invoice'), self.pending_invoices))
