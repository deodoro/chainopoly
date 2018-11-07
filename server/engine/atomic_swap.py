#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine.entities import Account
from engine.fungible import Fungible
from engine.nonfungible import NonFungible

class AtomicSwap:
    def __init__(self, fungible, nonfungible):
        self.fungible = fungible
        self.fungible.set_notifier(lambda f,t,v: self.notify_transaction(f, t, v))
        self.nonfungible = nonfungible
        self.pending_fungible = []
        self.pending_nonfungible = []

    def add_iou(self, creditor, debitor, value):
        self.pending_fungible.append({"creditor": creditor, "debitor": debitor, "value": value})

    def add_iofferu(self, creditor, debitor, token, value):
        self.pending_nonfungible.append({"creditor": creditor, "debitor": debitor, "token": token, "value": value})

    def notify_transaction(self, _from, _to, value):
        for t in self.pending_fungible:
            if t["creditor"]._id == _to._id and t["debitor"]._id == _from._id and t["value"] == value:
                self.pending_fungible.remove(t)
                return True
        for t in self.pending_nonfungible:
            if t["creditor"]._id == _to._id and t["debitor"]._id == _from._id and t["value"] == value:
                self.pending_nonfungible.remove(t)
                return True
        return False

    def has_pending(self, account):
        return len([i for i in self.pending_fungible if i["debitor"]._id == account._id]) > 0 or \
               len([i for i in self.pending_nonfungible if i["debitor"]._id == account._id]) > 0
