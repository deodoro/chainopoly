#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine import Fungible, Account

def test_balance():
    t = Fungible()
    assert t.balance_of(Account("0")) == 10 ** 10
    assert t.balance_of(Account("1")) == 0

def test_transfer():
    t = Fungible()
    assert t.transfer(Account("0"), Account("1"), 10)
    assert t.balance_of(Account("0")) == 10 ** 10 - 10
    assert t.balance_of(Account("1")) == 10
