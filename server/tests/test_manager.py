from engine import manager

def test_init():
    m = manager.Manager()
    assert m.players == []
    assert len([p for p in m.list_properties() if p != None]) == 28
    for p in m.list_properties():
        if p != None:
            assert m.properties.who_owns(p._id)._id == m.properties.account._id
