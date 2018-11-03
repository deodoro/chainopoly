import tornado.ioloop
import logging
from pyee import EventEmitter
from engine.game import Game
from websocket_handler import broadcast

logger = logging.getLogger('game_collection')

def broadcast_new_player(game_id, player):
    logger.debug('new player game=%d player=%r' % (game_id, player))
    broadcast('new_player', payload={'player': player, 'game_id': game_id})

def broadcast_new_game(game):
    logger.debug('new game game=%r' % game)
    broadcast('new_game', payload={'id': game['id'], 'title': game['title']})

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
        self.ee.on('newgame', broadcast_new_game)
        self.ee.on('newplayer', broadcast_new_player)

    def get(self, idx):
        if idx < 0 or idx >= len(self.games):
            return None
        else:
            return self.games[idx]['game']

    def deduplicate_title(self, title):
        new_title = title
        count = 1
        for item in self.games:
            if new_title == item['title']:
                new_title = "%s (%d)" % (title, count)
                count += 1
        return new_title

    def new(self, title):
        new_id = len(self.games)
        game = {'id': new_id, 'title': self.deduplicate_title(title), 'game': Game(new_id, self.ee)}
        self.games.append(game)
        self.ee.emit('newgame', game)
        return game

    def list(self):
        return self.games

    # def add_socket(self, game_id, player_id, ws):
    #     if player_id not in self.games[game_id]['sockets']:
    #         self.games[game_id]['sockets']['player_id'] = ws
    #         return True
    #     else:
    #         return False

    # def remove_socket(self, ws):
    #     for item in self.games:
    #         for player, socket in item['sockets'].items():
    #             if socket == ws:
    #                 del(item['sockets']['player'])
    #                 return True
    #     return False