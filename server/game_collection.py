import tornado.ioloop
import logging
from pyee import EventEmitter
from engine import Game
from websocket_handler import broadcast

logger = logging.getLogger('game_collection')

def broadcast_new_player(game_id, player):
    logger.debug('new player game=%d player=%r' % (game_id, player))
    broadcast('new_player', payload={'game_id': game_id, 'player': player})

def broadcast_move(game_id, player):
    logger.debug('move game=%s player=%r' % (game_id, player))
    broadcast('move', payload={'game_id': game_id, 'player': player})

def broadcast_action(game_id, player, info):
    logger.debug('action game=%s player=%s action=%s' % (game_id, player, info))
    broadcast('action', payload={'game_id': game_id, 'player': player, 'info': info})

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
        self.ee = EventEmitter(tornado.ioloop.IOLoop.current().asyncio_loop)
        self.ee.on('newplayer', broadcast_new_player)
        self.ee.on('move', broadcast_move)
        self.ee.on('action', broadcast_action)
        self.games = [{'id': 1, 'title': 'Chainopoly', 'game': Game(1, self.ee)}]

    def get(self):
        return self.games[0]['game']

    def new(self, title):
        pass

    def list(self):
        return self.games
