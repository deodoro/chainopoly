from engine import Game, State
import pytest

class MockEE:
    def __init__(self):
        self.event_array = []

    def emit(self, type, **kwargs):
        self.event_array.append({**kwargs, "type": type})

    def check_event(self, event, attribs):
        flattened = flatten_dict(event)
        for k,v in attribs.items():
            if k not in flattened or flattened[k] != v:
                return False
        return True

    def get_event(self, idx):
        return self.event_array[idx]

@pytest.fixture
def game():
    return Game(0, MockEE())

# https://codereview.stackexchange.com/questions/21033/flatten-dictionary-in-python-functional-style
def flatten_dict(d):
    def expand(key, value):
        if isinstance(value, dict):
            return [ (key + '.' + k, v) for k, v in flatten_dict(value).items() ]
        else:
            return [ (key, value) ]
    items = [ item for k, v in d.items() for item in expand(k, v) ]
    return dict(items)

def test_init(game):
    assert game.players == []
    assert len([p for p in game.list_properties() if p != None]) == 28
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
    game.register_player("1", "deodoro")
    assert len(players) == 2

def test_status(game):
    game.set_check_pending(False)
    game.register_player("1", "deodoro")
    game.register_player("2", "mario")
    assert game.status == State.INIT
    game.roll()
    assert game.status == State.WAIT
    assert game.get_player("1")["current"]
    assert not game.get_player("2")["current"]
    game.commit("1")
    assert game.status == State.MOVE
    assert not game.get_player("1")["current"]
    assert not game.get_player("2")["current"]
    game.roll()
    game.commit("1")
    assert game.status == State.WAIT
    assert not game.get_player("1")["current"]
    assert game.get_player("2")["current"]
    game.commit("2")
    assert game.status == State.MOVE
    assert not game.get_player("1")["current"]
    assert not game.get_player("2")["current"]

def test_move_events(game):
    game.set_check_pending(False)
    assert game.ee.check_event(game.ee.get_event(-1), {"type": "status", "status": "init"})
    game.register_player("1", "deodoro")
    assert game.ee.check_event(game.ee.get_event(-1), {"type": "newplayer", "player.account": "1", "player.alias": "deodoro", "player.position": 0})
    game.register_player("2", "mario")
    assert game.ee.check_event(game.ee.get_event(-1), {"type": "newplayer", "player.account": "2", "player.alias": "mario", "player.position": 0})
    game.roll(1)
    assert game.ee.check_event(game.ee.get_event(-2), {"type": "move", "player.account": "1"})
    assert game.ee.check_event(game.ee.get_event(-1), {"type": "action", "info.action": "buy", "player.account": "1", "info.property.id": 1})
    game.commit("1")
    game.roll(2)
    assert game.ee.check_event(game.ee.get_event(-2), {"type": "move", "player.account": "2"})
    assert game.ee.check_event(game.ee.get_event(-1), {"type": "action", "info.action": "parking", "player.account": "2"})

def test_buy_property(game):
    game.register_player("1", "deodoro")
    game.register_player("2", "mario")
    game.roll(1)
    assert game.ee.check_event(game.ee.get_event(-2), {"type": "move", "player.account": "1"})
    assert game.ee.check_event(game.ee.get_event(-1), {"type": "action", "info.action": "buy", "player.account": "1", "info.property.id": 1})
    assert not game.commit("1")
    game.money.transfer(game.accounts["1"], game.properties.account, 60)
    assert game.commit("1")
    game.roll(1)
    assert game.ee.check_event(game.ee.get_event(-2), {"type": "move", "player.account": "2"})
    assert game.ee.check_event(game.ee.get_event(-1), {"type": "action", "info.action": "rent", "player.account": "2"})
    assert not game.commit("2")
    game.money.transfer(game.accounts["2"], game.accounts["1"], 2)
    assert game.commit("2")
