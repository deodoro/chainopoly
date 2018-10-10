#!/usr/bin/env python3
# -*- coding: utf-8 -*-

class Account:
    def __init__(self, id):
        self._id = id
        self.balance = 0

class Property:
    def __init__(self, name, color, price):
        self.name = name
        self.color = color
        self.price = price
