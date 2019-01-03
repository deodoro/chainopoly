import tornado.ioloop
import logging
from engine import Game, EventEmitterSingleton
from websocket_handler import broadcast

logger = logging.getLogger('game_collection')

def broadcast_new_player(info):
    logger.debug('new player player=%r' % player)
    broadcast('new_player', payload=info)

def broadcast_action(info):
    logger.debug('action action=%r' % info)
    broadcast('action', payload=info)

class GameCollection:
    # Here will be the instance stored.
    __instance = None

    @staticmethod
    def instance():
        """ Static access method. """
        if GameCollection.__instance == None:
            GameCollection()
        return GameCollection.__instance

    def __init__(self):
        """ Virtually private constructor. """
        if GameCollection.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            GameCollection.__instance = self
        self.games = []
        self.ee = EventEmitterSingleton.instance()
        self.ee.on('newplayer', broadcast_new_player)
        self.ee.on('action', broadcast_action)
        self.games = [{'title': 'Chainopoly', 'game': Game()}]

    def get(self):
        return self.games[0]['game']

    def new(self, title):
        pass

    def list(self):
        return self.games
