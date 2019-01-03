#!/usr/bin/env python3
# -*- coding: utf-8 -*-

class NonFungible(object):
    def __init__(self):
        self.account = "0"
        self.ownership = {self.account: []}
        self.ownership_reverse = {}
        self.tokenUris = {}
        self.pending = []

    def check_ownership_for_account(self, account):
        if account not in self.ownership:
            self.ownership[account] = []

    def mint(self, token, uri = None):
        if token not in self.ownership_reverse:
            self.ownership[self.account].append(token)
            self.ownership_reverse[token] = self.account
            self.set_uri(token, uri)
            return True
        else:
            return False

    def set_uri(self, token, uri):
        if uri:
            self.tokenUris[token] = uri

    def get_uri(self, token):
        return self.tokenUris[token] if token in self.tokenUris else None

    # Transfere de um indivíduo para outro
    def transfer(self, _to, token):
        if token in self.ownership_reverse:
            self.pending.append((self.ownership_reverse[token], _to, token))
            return True
        else:
            return False

    def confirm(self, _to, token):
        if token in self.ownership_reverse:
            _from = self.ownership_reverse[token]
            if (_from, _to, token) in self.pending:
                self.check_ownership_for_account(_to)
                self.ownership[_from].remove(token)
                self.ownership[_to].append(token)
                self.ownership_reverse[token] = _to
                return True
        return False

    def cancel(self, _to, token):
        if token in self.ownership_reverse:
            _from = self.ownership_reverse[token]
            if (_from, _to, token) in self.pending:
                self.pending.remove((_from, _to, token))
                return True
        return False

    # Who owns this token?
    def who_owns(self, token):
        if token in self.ownership_reverse and self.ownership_reverse[token] != self.account:
            return self.ownership_reverse[token]
        else:
            return None

    # Which tokens does this account own?
    def what_owns(self, account):
        return self.ownership[account] if account in self.ownership else []
