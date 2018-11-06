from engine import game

def test_init():
    m = game.Game(0)
    assert m.players == []
    assert len([p for p in m.list_properties() if p != None]) == 28
    for p in m.list_properties():
        if p != None:
            assert m.properties.who_owns(p._id)._id == m.properties.account._id

def test_register():
    m = game.Game(0)
    assert m.players == []
    m.register_player('0', 'deodoro')
    m.register_player('1', 'mario')
    players = m.list_players()
    assert len(players) == 2
    assert len([i for i in players if i['alias'] == 'deodoro']) == 1
    assert len([i for i in players if i['alias'] == 'mario']) == 1
    m.register_player('0', 'deodoro')
    assert len(players) == 2

def test_status():
    m = game.Game(0)
    assert m.players == []
    m.register_player('0', 'deodoro')
    m.register_player('1', 'mario')
    assert m.status == game.State.INIT
    m.roll()
    assert m.status == game.State.WAIT
    assert m.get_player('0')['current']
    assert not m.get_player('1')['current']
    m.commit('0')
    assert m.status == game.State.MOVE
    assert not m.get_player('0')['current']
    assert not m.get_player('1')['current']
    m.roll()
    m.commit('0')
    assert m.status == game.State.WAIT
    assert not m.get_player('0')['current']
    assert m.get_player('1')['current']
    m.commit('1')
    assert m.status == game.State.MOVE
    assert not m.get_player('0')['current']
    assert not m.get_player('1')['current']
