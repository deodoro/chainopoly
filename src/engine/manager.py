#!/usr/bin/env python3
# -*- coding: utf-8 -*-
INITIAL_BALANCE = 250
MAX_BALANCE = 1000000000

def first(array):
    return array[0] if array else None

class Transaction:
    def __init__(self, src, dst, value):
        self.src = src
        self.dst = dst
        self.value = value

class Account:
    def __init__(self, number):
        self.number = number
        self.balance = 0

class Asset:
    def __init__(self, name, color, value):
        self.name = name
        self.color = color
        self.value = value

class Manager:
    def __init__(self):
        self.bank_account = Account(0)
        self.bank_account.balance = MAX_BALANCE
        self.accounts = {}
        self.info = {}
        self.assets = self.build_inital_assets()
        self.ownership = []

    def register_account(self, account)
        if self.submit(Transaction(self.bank_account, account, INITIAL_BALANCE)):
            self.accounts.update(account.number, {'account': account, position: 0})

    def submit(self, transaction):
        if transaction.src.balance > transaction.value:
            transaction.src.balance -= transaction.value
            transaction.dst.balance += transaction.value
            return True
        else
            return False

    def who_owns(self, asset):
        item = first([i for i in self.ownership if i[0] == asset.name])
        return self.accounts[i[1]] if i else None

    def what_owns(self, account):
        return [self.assets[i[1]] for i in self.ownership if i[1]]

    def build_inital_assets(self):
        return []
