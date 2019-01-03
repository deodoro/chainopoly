#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine import Fungible, NonFungible, AtomicSwap
import pytest

@pytest.fixture
def info():
    fungible = Fungible()
    nonfungible = NonFungible()
    nonfungible.mint(1)
    nonfungible.mint(2)
    swap = AtomicSwap(fungible, nonfungible)
    return (fungible, nonfungible, swap)

def test_fungible(info):
    fungible, nonfungible, swap = info
    a = "0"
    o = "1"
    d = "2"
    nonfungible.transfer('1', 1)
    nonfungible.confirm('1', 1)
    fungible.transfer(a, d, 10)
    swap.add_invoice(d, 1, 5)
    assert swap.has_pending(d)
    fungible.transfer(d, o, 5)
    assert not swap.has_pending(d)

def test_nonfungible(info):
    fungible, nonfungible, swap = info
    a = "0"
    d = "1"
    fungible.transfer(a, d, 10)
    swap.add_offer(d, token=1, value=5)
    assert swap.has_pending(d)
    fungible.transfer(d, a, 5)
    assert not swap.has_pending(d)

def test_nonfungible_cancel(info):
    fungible, nonfungible, swap = info
    a = "0"
    d = "1"
    fungible.transfer(a, d, 10)
    swap.add_offer(d, token=1, value=5)
    assert swap.has_pending(d)
    assert swap.cancel_offer(token=1)
    assert fungible.balance_of(d) == 10
    assert not nonfungible.who_owns(1)

def test_pending(info):
    fungible, nonfungible, swap = info
    a = "0"
    o = "1"
    d = "2"
    nonfungible.transfer('1', 1)
    nonfungible.confirm('1', 1)
    fungible.transfer(a, d, 10)
    swap.add_invoice(d, 1, 5)
    swap.add_offer(d, token=2, value=5)
    assert swap.pending()
    fungible.transfer(d, o, 5)
    assert swap.pending()
    fungible.transfer(d, a, 5)
    assert not swap.pending()
