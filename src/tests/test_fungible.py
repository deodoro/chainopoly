from engine import fungible
from engine.entities import *
import pytest

def test_balance():
    t = fungible.Fungible()
    assert t.balanceOf(Account(0)) == 10 ** 10
    assert t.balanceOf(Account(1)) == 0

def test_transfer():
    t = fungible.Fungible()
    assert t.transfer(Account(0), Account(1), 10)
    assert t.balanceOf(Account(0)) == 10 ** 10 - 10
    assert t.balanceOf(Account(1)) == 10
