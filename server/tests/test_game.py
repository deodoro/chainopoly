from engine import Game, EventEmitterSingleton
from collections import deque
from random import seed
import pytest

event_queue = deque()

# https://codereview.stackexchange.com/questions/21033/flatten-dictionary-in-python-functional-style
def flatten_dict(d):
    def expand(key, value):
        if isinstance(value, dict):
            return [ (key + '.' + k, v) for k, v in flatten_dict(value).items() ]
        else:
            return [ (key, value) ]
    items = [ item for k, v in d.items() for item in expand(k, v) ]
    return dict(items)

def check_event(data):
    flattened = flatten_dict(event_queue.popleft())
    print(flattened)
    for k,v in data.items():
        if k not in flattened or flattened[k] != v:
            print("%s -> %s != %s" % (k, flattened[k], v))
            return False
    return True

def queue_event(evt):
    def handler(info):
        event_queue.append({'event': evt, **info})
    return handler

@pytest.fixture
def game():
    # By seed(0), random sequence for dice becomes [8, 8, 2, 6, 10, 9, 8, 6, 9, 7, 11, 5, 10, 4, 6, 4, 3, 11, 6, 10]
    global event_queue
    seed(0)
    event_queue = deque()
    ee = EventEmitterSingleton.instance()
    ee.remove_all_listeners()
    for e in ['transaction', 'newplayer', 'newround', 'offer', 'invoice', 'match', 'leaving']:
        ee.on(e, queue_event(e))
    return Game()

def test_init(game):
    assert game.players == []
    assert len([p for p in game.list_properties() if p != None]) == 22
    for p in game.list_properties():
        if p != None:
            assert not game.properties.who_owns(p._id)

def test_register(game):
    game.register_player("1", "deodoro")
    game.register_player("2", "mario")
    players = game.list_players()
    assert len(players) == 2
    assert len([i for i in players if i["alias"] == "deodoro"]) == 1
    assert len([i for i in players if i["alias"] == "mario"]) == 1
    try:
        game.register_player("1", "deodoro")
        assert False
    except Exception as e:
        assert True

def test_unregister(game):
    game.register_player("1", "deodoro")
    game.register_player("2", "mario")
    game.register_player("3", "jiji")
    assert check_event({"event": "transaction"})
    assert check_event({"event": "newplayer"})
    assert check_event({"event": "transaction"})
    assert check_event({"event": "newplayer"})
    assert check_event({"event": "newround"})
    assert check_event({"event": "offer"})
    assert check_event({"event": "transaction"})
    assert check_event({"event": "newplayer"})
    players = game.list_players()
    assert len(players) == 3
    assert len([i for i in players if i["alias"] == "deodoro"]) == 1
    assert len([i for i in players if i["alias"] == "mario"]) == 1
    assert len([i for i in players if i["alias"] == "jiji"]) == 1
    game.unregister_player("2")
    assert check_event({"event": "transaction"})
    assert check_event({"event": "leaving", "player": "2"})
    players = game.list_players()
    assert len(players) == 2
    assert len([i for i in players if i["alias"] == "deodoro"]) == 1
    assert len([i for i in players if i["alias"] == "mario"]) == 0
    assert len([i for i in players if i["alias"] == "jiji"]) == 1

def test_move_events(game):
    # players are registered
    game.register_player("1", "deodoro")
    assert check_event({"event": "transaction"})
    assert check_event({"event": "newplayer", "player.account": "1", "player.alias": "deodoro", "player.position": 0})
    game.register_player("2", "mario")
    assert check_event({"event": "transaction"})
    assert check_event({"event": "newplayer", "player.account": "2", "player.alias": "mario", "player.position": 0})
    # dice are rolled
    assert check_event({"event": "newround", "round": 1})
    assert check_event({"event": "offer", "_to": "1", "token": 4})
    assert len(event_queue) == 0

def test_buy_property(game):
    game.register_player("1", "deodoro")
    game.register_player("2", "mario")
    assert check_event({"event": "transaction"})
    assert check_event({"event": "newplayer"})
    assert check_event({"event": "transaction"})
    assert check_event({"event": "newplayer"})
    assert check_event({"event": "newround"})
    assert check_event({"event": "offer", "_to": "1", "token": 4})
    game.money.transfer("1", game.properties.account, 100)
    assert check_event({"event": "transaction"})
    assert check_event({"event": "match"})
    assert check_event({"event": "newround"})

def test_a_few_rounds(game):
    game.register_player("1", "deodoro")
    game.register_player("2", "mario")
    assert check_event({"event": "transaction"})
    assert check_event({"event": "newplayer"})
    assert check_event({"event": "transaction"})
    assert check_event({"event": "newplayer"})
    assert check_event({"event": "newround"})
    assert check_event({"event": "offer", "_to": "1", "token": 4})
    game.money.transfer("1", game.properties.account, 100)
    assert check_event({"event": "transaction"})
    assert check_event({"event": "match"})
    assert check_event({"event": "newround"})
    assert check_event({"event": "offer", "_to": "2", "token": 8})
    game.money.transfer("2", game.properties.account, 160)
    assert check_event({"event": "transaction"})
    assert check_event({"event": "match"})
    assert check_event({"event": "newround"})
    assert check_event({"event": "offer", "_to": "2", "token": 13})
    game.money.transfer("2", game.properties.account, 220)
    assert check_event({"event": "transaction"})
    assert check_event({"event": "match"})
    assert check_event({"event": "newround"})
    assert check_event({"event": "offer", "_to": "2", "token": 17})
    game.money.transfer("2", game.properties.account, 280)
    assert check_event({"event": "transaction"})
    assert check_event({"event": "match"})
    assert check_event({"event": "newround"})
    assert check_event({"event": "offer", "_to": "1", "token": 21})
    game.money.transfer("1", game.properties.account, 350)
    assert check_event({"event": "transaction"})
    assert check_event({"event": "match"})
    assert check_event({"event": "newround"})
    assert check_event({"event": "offer", "_to": "2", "token": 1})
    game.money.transfer("2", game.properties.account, 60)
    assert check_event({"event": "transaction"})
    assert check_event({"event": "match"})
    assert check_event({"event": "newround"})
    assert check_event({"event": "offer", "_to": "1", "token": 10})
    game.money.transfer("1", game.properties.account, 180)
    assert check_event({"event": "transaction"})
    assert check_event({"event": "match"})
    assert check_event({"event": "newround"})
    assert check_event({"event": "offer", "_to": "1", "token": 14})
    assert check_event({"event": "offer", "_to": "2", "token": 5})
    game.money.transfer("1", game.properties.account, 240)
    game.money.transfer("2", game.properties.account, 120)
    assert check_event({"event": "transaction"})
    assert check_event({"event": "match"})
    assert check_event({"event": "transaction"})
    assert check_event({"event": "match"})
    assert check_event({"event": "newround"})
    assert check_event({"event": "offer", "_to": "1", "token": 16})
    game.money.transfer("1", game.properties.account, 260)
    assert check_event({"event": "transaction"})
    assert check_event({"event": "match"})
    assert check_event({"event": "newround"})
    assert check_event({"event": "offer", "_to": "2", "token": 20})
    game.money.transfer("2", game.properties.account, 320)
    assert check_event({"event": "transaction"})
    assert check_event({"event": "match"})
    assert check_event({"event": "newround"})
    assert check_event({"event": "invoice", "_from": "2", "_to": "1", "token": 21})
    game.money.transfer("2", "1", 35)
    assert check_event({"event": "transaction"})
    assert check_event({"event": "match"})
    assert check_event({"event": "newround"})
