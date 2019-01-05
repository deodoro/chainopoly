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
from engine import Game, EventEmitterSingleton
from websocket_handler import WebSocketHandler, broadcast

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
game = Game()

class BoardHandler(tornado.web.RequestHandler):
    def get(self):
        self.set_header('Content-Type', 'application/json')
        self.write(json.dumps([i.to_dict() for i in Game.get_properties()]))

class PlayerHandler(tornado.web.RequestHandler):
    def get(self):
        try:
            global game
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps(game.list_players()))
        except Exception as e:
            logger.exception('Retrieving players for game #%s' % id)
            self.set_status(400)
            self.write('Invalid game')

    def post(self):
        try:
            args = json.loads(self.request.body)
            global game
            game.register_player(args['account'], args['username'])
            self.set_header('Content-Type', 'application/json')
            self.write({'result': 'ok'})
        except Exception as e:
            logger.exception('Could not register for game')
            self.set_status(400)
            self.write('Invalid game')

class PlayerInfoHandler(tornado.web.RequestHandler):
    def get(self, player_id):
        try:
            global game
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps(game.get_player(player_id)))
        except Exception as e:
            logger.exception('Retrieving player %s' % player_id)
            self.set_status(400)
            self.write('Invalid game')

    def delete(self, player_id):
        try:
            global game
            self.set_header('Content-Type', 'application/json')
            game.unregister_player(player_id)
            self.write({'result': 'ok'})
        except Exception as e:
            logger.exception('Retrieving player %s' % player_id)
            self.set_status(400)
            self.write('Invalid game')

class PropertiesHandler(tornado.web.RequestHandler):
    def get(self, player_id=-1):
        try:
            global game
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps(game.get_player_properties(player_id)))
        except Exception as e:
            logger.exception('Retrieving properties for player %s' % player_id)
            self.set_status(400)
            self.write('Invalid game')

class BalanceHandler(tornado.web.RequestHandler):
    def get(self, player_id=-1):
        try:
            global game
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps(game.get_player_balance(player_id)))
        except Exception as e:
            logger.exception('Retrieving balance for player %s' % player_id)
            self.set_status(400)
            self.write('Invalid game')

class TransferHandler(tornado.web.RequestHandler):
    def post(self):
        args = json.loads(self.request.body)
        try:
            global game
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
            global game
            if args["source"] not in game.accounts:
                raise Exception('Invalid debit account')
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps({"result": game.swap.reject(debitor=game.accounts[args["source"]])}))
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
            (r'/api/game/players', PlayerHandler),
            (r'/api/board', BoardHandler),
            (r'/ws', WebSocketHandler),
            (r'/start', tornado.web.StaticFileHandler, {'path': static_path, 'default_filename': 'index.html'}),
            (r'/panel/*', tornado.web.StaticFileHandler, {'path': static_path, 'default_filename': 'index.html'}),
            (r'/(.*)', tornado.web.StaticFileHandler, {'path': static_path, 'default_filename': 'index.html'}),
        ]
        logger.info('Static files from %s' % static_path)

        # Hooks to propagate events to websockets
        def do_broadcast(e):
            def f(info):
                print("broadcasting %s payload=%r" % (e, info))
                broadcast(e, payload=info)
            return f
        for e in ['transaction', 'newplayer', 'newround', 'offer', 'invoice', 'match', 'leaving']:
            EventEmitterSingleton.instance().on(e, do_broadcast(e))

        # Server initialization
        webServerPort = os.getenv('PORT') or 8080
        application = tornado.web.Application(urls, autoreload=True, debug=True, static_path=".")
        application.listen(webServerPort)

        # Event loop initialization
        logger.info('Webserver is listening to port %s' % webServerPort)
        tornado.ioloop.IOLoop.instance().start()
    except Exception as e:
        logger.exception('Webserver fatal error')
