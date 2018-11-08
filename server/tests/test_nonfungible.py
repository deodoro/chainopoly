#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from engine import NonFungible
from engine.entities import *
import pytest

@pytest.fixture
def token():
    token = NonFungible()
    token.mint(1)
    return token

def test_mint():
    t = NonFungible()
    assert t.who_owns(1) == None
    t.mint(1)
    assert not t.who_owns(1)
    assert t.what_owns(t.account) == [1]

def test_transfer(token):
    a = Account(1)
    assert token.transfer(a, 1)
    assert token.what_owns(token.account) == [1]
    assert token.what_owns(a) == []
    assert token.who_owns(1) == None
    assert token.confirm(a, 1)
    assert token.who_owns(1)._id == 1

def test_uri(token):
    assert token.get_uri(1) == None
    token.set_uri(1, 'teste')
    assert token.get_uri(1) == 'teste'
