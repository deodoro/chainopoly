#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json

class Account:
    def __init__(self, id):
        self._id = id
        self.balance = 0

    def to_dict(self):
        return {'account': self._id}

    def to_json(self):
        return json.dumps(self.to_dict())

class Property:
    LAST_ID = 1

    def __init__(self, name, color, price, rent, position, geo = None):
        self.name = name
        self.color = color
        self.price = price
        self.rent = rent
        self.position = position
        self._id = Property.LAST_ID
        self.geo = geo
        Property.LAST_ID += 1

    def to_dict(self):
        return {'name': self.name, 'color': self.color, 'price': self.price, 'rent': self.rent, 'id': self._id, 'position': self.position, 'geo': self.geo}

    def to_json(self):
        return json.dumps(self.to_dict())
