#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import tornado.ioloop
import tornado.web
import tornado.autoreload
import json
import logging
import os
import sys
from pyee import EventEmitter
from game_collection import GameCollection
from websocket_handler import WebSocketHandler

# Boilerplate - configurar um logger global para console e para arquivo
log_format = '%(asctime)s %(levelname)s:%(name)s:%(message)s'
date_format = '%Y-%m-%d %H:%M:%S'
logging.basicConfig(filename=os.path.join('logs', 'monopoly.log'), level=logging.DEBUG,format=log_format, datefmt=date_format)
logger = logging.getLogger('server')
ch = logging.StreamHandler(sys.stdout)
ch.setLevel(logging.DEBUG)
formatter = logging.Formatter(log_format)
ch.setFormatter(formatter)
logging.getLogger('').addHandler(ch)

class BoardHandler(tornado.web.RequestHandler):
    def get(self):
        with open('engine/properties.json') as data_file:
            self.set_header('Content-Type', 'application/json')
            self.write(data_file.read())

class GameHandler(tornado.web.RequestHandler):
    def post(self, id = None):
        try:
            args = json.loads(self.request.body)
            new_game = GameCollection.instance().new("%s's game" % args['username'])
            new_game['game'].register_player(args['account'], args['username'])
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps({'id': new_game['id'], 'title': new_game['title']}))
        except Exception as e:
            logger.exception('Creating game')
            self.set_status(400)
            self.write('Registro inválido')

    def get(self, id = None):
        self.set_header('Content-Type', 'application/json')
        if id:
            self.write(json.dumps(GameCollection.instance().get(int(id))['title']))
        else:
            self.write(json.dumps([{'id': i['id'], 'title': i['title'], 'players': len(i['game'].list_players())} for i in GameCollection.instance().list()]))

class PlayerHandler(tornado.web.RequestHandler):
    def get(self, id=-1):
        try:
            game = GameCollection.instance().get(int(id))
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps(game.list_players()))
        except Exception as e:
            logger.exception('Retrieving players for game #%s' % id)
            self.set_status(400)
            self.write('Invalid game')

    def post(self, id=-1):
        try:
            args = json.loads(self.request.body)
            game = GameCollection.instance().get(int(id))
            if game:
                if game.register_player(args['account'], args['username']):
                    self.set_header('Content-Type', 'application/json')
                    self.write({'result': 'Registered for game#%s' % id})
                else:
                    self.set_status(400)
                    self.set_header('Content-Type', 'application/json')
                    self.write({'result': 'Ongoing game or already registered'})
            else:
                self.set_status(400)
                self.set_header('Content-Type', 'application/json')
                self.write({'result': 'Game does not exist'})
        except Exception as e:
            logger.exception('Retrieving players for game #%s' % id)
            self.set_status(400)
            self.write('Invalid game')

class PlayerInfoHandler(tornado.web.RequestHandler):
    def get(self, game_id=-1, player_id=-1):
        try:
            game = GameCollection.instance().get(int(game_id))
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps(game.get_player(player_id)))
        except Exception as e:
            logger.exception('Retrieving player %s for game #%s' % (player_id, game_id))
            self.set_status(400)
            self.write('Invalid game')

class PropertiesHandler(tornado.web.RequestHandler):
    def get(self, game_id=-1, player_id=-1):
        try:
            game = GameCollection.instance().get(int(game_id))
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps(game.get_player_properties(player_id)))
        except Exception as e:
            logger.exception('Retrieving properties for player %s for game #%s' % (player_id, game_id))
            self.set_status(400)
            self.write('Invalid game')

class BalanceHandler(tornado.web.RequestHandler):
    def get(self, game_id=-1, player_id=-1):
        try:
            game = GameCollection.instance().get(int(game_id))
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps(game.get_player_balance(player_id)))
        except Exception as e:
            logger.exception('Retrieving balance for player %s for game #%s' % (player_id, game_id))
            self.set_status(400)
            self.write('Invalid game')

class StatusHandler(tornado.web.RequestHandler):
    def get(self, game_id=-1):
        try:
            game = GameCollection.instance().get(int(game_id))
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps(game.get_status()))
        except Exception as e:
            logger.exception('Retrieving status game #%s' % game_id)
            self.set_status(400)
            self.write('Invalid game')

class ControlHandler(tornado.web.RequestHandler):
    def post(self, game_id=-1):
        args = json.loads(self.request.body)
        try:
            game = GameCollection.instance().get(int(game_id))
            self.set_header('Content-Type', 'application/json')
            if args['action'] == 'roll':
                game.roll()
                self.write({'result': 'roll'})
            elif args['action'] == 'commit':
                game.commit(args['account_id'])
                self.write({'result': 'commit'})
        except Exception as e:
            logger.exception('Game control action %r' % args)
            self.set_status(400)
            self.write('Invalid game')

# Framework do servidor
if __name__ == '__main__':
    try:
        logger.info('Webserver boot')

        urls = [
            (r'/api/game/(.+?)/properties/(.+)', PropertiesHandler),
            (r'/api/game/(.+?)/balance/(.+)', BalanceHandler),
            (r'/api/game/(.+?)/player/(.+)', PlayerInfoHandler),
            (r'/api/game/(.+)/status', StatusHandler),
            (r'/api/game/(.+)/control', ControlHandler),
            (r'/api/game', GameHandler),
            (r'/api/game/(.+)', GameHandler),
            (r'/api/players/(.+)', PlayerHandler),
            (r'/api/board', BoardHandler),
            (r'/ws', WebSocketHandler),
        ]

        # Iniciar servidor
        webServerPort = os.getenv('PORT') or 8080
        application = tornado.web.Application(urls, autoreload=True)
        application.listen(webServerPort)

        # Iniciar loop de servidor
        logger.info('Webserver is listening to port %s' % webServerPort)
        tornado.ioloop.IOLoop.instance().start()
    except Exception as e:
        logger.exception('Webserver fatal error')
