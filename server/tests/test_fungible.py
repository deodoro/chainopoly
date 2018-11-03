#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine import fungible
from engine.entities import *

def test_balance():
    t = fungible.Fungible()
    assert t.balance_of(Account(0)) == 10 ** 10
    assert t.balance_of(Account(1)) == 0

def test_transfer():
    t = fungible.Fungible()
    assert t.transfer(Account(0), Account(1), 10)
    assert t.balance_of(Account(0)) == 10 ** 10 - 10
    assert t.balance_of(Account(1)) == 10
