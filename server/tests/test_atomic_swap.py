#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine import Fungible, NonFungible, Account, AtomicSwap
import pytest

@pytest.fixture
def info():
    fungible = Fungible()
    nonfungible = NonFungible()
    nonfungible.mint(1)
    swap = AtomicSwap(fungible, nonfungible)
    return (fungible, nonfungible, swap)

def test_fungible(info):
    fungible, nonfungible, swap = info
    a = Account("0")
    o = Account("1")
    d = Account("2")
    fungible.transfer(a, d, 10)
    swap.add_iou(o, d, 5)
    assert swap.has_pending(d)
    fungible.transfer(d, o, 5)
    assert not swap.has_pending(d)

def test_nonfungible(info):
    fungible, nonfungible, swap = info
    a = Account("0")
    d = Account("1")
    fungible.transfer(a, d, 10)
    swap.add_iofferu(d, token=1, value=5)
    print(swap.pending_nonfungible)
    assert swap.has_pending(d)
    fungible.transfer(d, a, 5)
    assert not swap.has_pending(d)

def test_unfungible_cancel(info):
    fungible, nonfungible, swap = info
    a = Account("0")
    d = Account("1")
    fungible.transfer(a, d, 10)
    swap.add_iofferu(d, token=1, value=5)
    assert swap.has_pending(d)
    assert swap.cancel_offer(token=1)
    assert fungible.balance_of(d) == 10
    assert not nonfungible.who_owns(1)
