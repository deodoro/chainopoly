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
from engine import Game
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
        self.set_header('Content-Type', 'application/json')
        self.write(json.dumps([i.to_dict() for i in Game.get_properties()]))

class PlayerHandler(tornado.web.RequestHandler):
    def get(self):
        try:
            game = GameCollection.instance().get()
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps(game.list_players()))
        except Exception as e:
            logger.exception('Retrieving players for game #%s' % id)
            self.set_status(400)
            self.write('Invalid game')

    def post(self):
        try:
            args = json.loads(self.request.body)
            game = GameCollection.instance().get()
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
    def get(self, player_id):
        try:
            game = GameCollection.instance().get()
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps(game.get_player(player_id)))
        except Exception as e:
            logger.exception('Retrieving player %s' % player_id)
            self.set_status(400)
            self.write('Invalid game')

class PropertiesHandler(tornado.web.RequestHandler):
    def get(self, player_id=-1):
        try:
            game = GameCollection.instance().get()
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps(game.get_player_properties(player_id)))
        except Exception as e:
            logger.exception('Retrieving properties for player %s' % player_id)
            self.set_status(400)
            self.write('Invalid game')

class BalanceHandler(tornado.web.RequestHandler):
    def get(self, player_id=-1):
        try:
            game = GameCollection.instance().get()
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps(game.get_player_balance(player_id)))
        except Exception as e:
            logger.exception('Retrieving balance for player %s' % player_id)
            self.set_status(400)
            self.write('Invalid game')

class ControlHandler(tornado.web.RequestHandler):
    def post(self):
        args = json.loads(self.request.body)
        try:
            game = GameCollection.instance().get()
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

class TransferHandler(tornado.web.RequestHandler):
    def post(self):
        args = json.loads(self.request.body)
        try:
            game = GameCollection.instance().get()
            if args["source"] not in game.accounts:
                raise Exception('Invalid debit account')
            if args["target"] not in game.accounts:
                raise Exception('Invalid credit account')
            if int(args["value"]) <= 0:
                raise Exception('Invalid value')
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps({"result": game.money.transfer(game.accounts[args["source"]], game.accounts[args["target"]], int(args["value"]))}))
        except Exception as e:
            logger.exception('Making transaction %r in game #%s' % (args, game_id))
            self.set_status(400)
            self.write(str(e))

class DeclineHandler(tornado.web.RequestHandler):
    def post(self):
        args = json.loads(self.request.body)
        try:
            game = GameCollection.instance().get()
            if args["source"] not in game.accounts:
                raise Exception('Invalid debit account')
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps({"result": game.swap.cancel_offer(debitor=game.accounts[args["source"]])}))
        except Exception as e:
            logger.exception('Declining offer %r in game #%s' % (args, game_id))
            self.set_status(400)
            self.write(str(e))

# Framework do servidor
if __name__ == '__main__':
    try:
        logger.info('Webserver boot')

        static_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "contents", "client")
        urls = [
            (r'/api/game/properties/(.+)', PropertiesHandler),
            (r'/api/game/transfer', TransferHandler),
            (r'/api/game/decline', DeclineHandler),
            (r'/api/game/balance/(.+)', BalanceHandler),
            (r'/api/game/player/(.+)', PlayerInfoHandler),
            (r'/api/game/control', ControlHandler),
            (r'/api/game/players', PlayerHandler),
            (r'/api/board', BoardHandler),
            (r'/ws', WebSocketHandler),
            (r'/start', tornado.web.StaticFileHandler, {'path': static_path, 'default_filename': 'index.html'}),
            (r'/panel/*', tornado.web.StaticFileHandler, {'path': static_path, 'default_filename': 'index.html'}),
            (r'/(.*)', tornado.web.StaticFileHandler, {'path': static_path, 'default_filename': 'index.html'}),
        ]
        logger.info('Static files from %s' % static_path)
        # Iniciar servidor
        webServerPort = os.getenv('PORT') or 8080
        application = tornado.web.Application(urls, autoreload=True, debug=True, static_path=".")
        application.listen(webServerPort)

        # Iniciar loop de servidor
        logger.info('Webserver is listening to port %s' % webServerPort)
        tornado.ioloop.IOLoop.instance().start()
    except Exception as e:
        logger.exception('Webserver fatal error')
