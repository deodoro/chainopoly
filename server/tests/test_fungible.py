#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine import Fungible

def test_balance():
    t = Fungible()
    assert t.balance_of("0") == 10 ** 10
    assert t.balance_of("1") == 0

def test_transfer():
    t = Fungible()
    assert t.transfer("0", "1", 10)
    assert t.balance_of("0") == 10 ** 10 - 10
    assert t.balance_of("1") == 10
