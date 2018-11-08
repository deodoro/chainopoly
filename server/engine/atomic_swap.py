#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine import Account, Fungible, NonFungible

class AtomicSwap:
    def __init__(self, fungible, nonfungible):
        self.fungible = fungible
        self.fungible.set_notifier(lambda f,t,v: self.notify_transaction(f, t, v))
        self.nonfungible = nonfungible
        self.pending_fungible = []
        self.pending_nonfungible = []

    def add_iou(self, creditor, debitor, value):
        self.pending_fungible.append({"creditor": creditor, "debitor": debitor, "value": value})
        return True

    def add_iofferu(self, debitor, token, value):
        if self.nonfungible.transfer(debitor, token):
            creditor = self.nonfungible.who_owns(token) or self.nonfungible.account
            self.pending_nonfungible.append({"creditor": creditor, "debitor": debitor, "token": token, "value": value})
            return True
        else:
            return False

    def notify_transaction(self, _from, _to, value):
        for t in self.pending_fungible:
            if t["creditor"]._id == _to._id and t["debitor"]._id == _from._id and t["value"] == value:
                self.pending_fungible.remove(t)
                return True
        for t in self.pending_nonfungible:
            if t["creditor"]._id == _to._id and t["debitor"]._id == _from._id and t["value"] == value:
                self.pending_nonfungible.remove(t)
                self.nonfungible.confirm(t['debitor'], t['token'])
                return True
        return False

    def cancel_offer(self, token = None, debitor = None):
        for t in self.pending_nonfungible:
            if (token and t["token"] == token) or (debitor and t["debitor"]._id == debitor._id):
                self.pending_nonfungible.remove(t)
                self.nonfungible.cancel(t['debitor'], t['token'])
                return True
        return False

    def has_pending(self, account):
        return len([i for i in self.pending_fungible if i["debitor"]._id == account._id]) > 0 or \
               len([i for i in self.pending_nonfungible if i["debitor"]._id == account._id]) > 0

