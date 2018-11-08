import tornado.ioloop
import logging
from pyee import EventEmitter
from engine import Game
from websocket_handler import broadcast

logger = logging.getLogger('game_collection')

def broadcast_new_player(game_id, player):
    logger.debug('new player game=%d player=%r' % (game_id, player))
    broadcast('new_player', payload={'game_id': game_id, 'player': player})

def broadcast_new_game(game):
    logger.debug('new game game=%r' % game)
    broadcast('new_game', payload={'game_id': game['id'], 'game': game})

def broadcast_move(game_id, player):
    logger.debug('move game=%s player=%r' % (game_id, player))
    broadcast('move', payload={'game_id': game_id, 'player': player})

def broadcast_status(game_id, status):
    logger.debug('status game=%s status=%s' % (game_id, status))
    broadcast('status', payload={'game_id': game_id, 'status': status})

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
        self.ee.on('newgame', broadcast_new_game)
        self.ee.on('newplayer', broadcast_new_player)
        self.ee.on('move', broadcast_move)
        self.ee.on('status', broadcast_status)
        self.ee.on('action', broadcast_action)

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
        self.ee.emit('newgame', {'id': game['id'], 'title': game['title']})
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
