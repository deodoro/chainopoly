#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json

class Account:
    def __init__(self, id):
        self._id = id
        self.balance = 0

class Property:
    LAST_ID = 1

    def __init__(self, name, color, price, rent, position):
        self.name = name
        self.color = color
        self.price = price
        self.rent = rent
        self.position = position
        self._id = Property.LAST_ID
        Property.LAST_ID += 1

    def to_json(self):
        return json.dumps({'name': self.name, 'color': self.color, 'price': self.price, 'rent': self.rent})
