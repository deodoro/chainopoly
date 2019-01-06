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
from random import seed

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
    def get(self, account):
        try:
            global game
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps(game.get_player(account)))
        except Exception as e:
            logger.exception('Retrieving player %s' % account)
            self.set_status(400)
            self.write('Invalid game')

    def delete(self, account):
        try:
            global game
            self.set_header('Content-Type', 'application/json')
            game.unregister_player(account)
            self.write({'result': 'ok'})
        except Exception as e:
            logger.exception('Retrieving player %s' % account)
            self.set_status(400)
            self.write('Invalid game')

class PropertiesHandler(tornado.web.RequestHandler):
    def get(self, account):
        try:
            global game
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps(game.get_player_properties(account)))
        except Exception as e:
            logger.exception('Retrieving properties for player %s' % account)
            self.set_status(400)
            self.write('Invalid game')

class BalanceHandler(tornado.web.RequestHandler):
    def get(self, account):
        try:
            global game
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps(game.get_player_balance(account)))
        except Exception as e:
            logger.exception('Retrieving balance for player %s' % account)
            self.set_status(400)
            self.write('Invalid game')

class TransferHandler(tornado.web.RequestHandler):
    def post(self):
        args = json.loads(self.request.body)
        try:
            global game
            if args["src"] not in game.accounts:
                raise Exception('Invalid debit account')
            if args["dst"] not in game.accounts:
                raise Exception('Invalid credit account')
            if int(args["value"]) <= 0:
                raise Exception('Invalid value')
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps({"result": game.money.transfer(args["src"], args["dst"], int(args["value"]))}))
        except Exception as e:
            logger.exception('Submitting transaction %r' % args)
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
            logger.exception('Declining offer %r' % args)
            self.set_status(400)
            self.write(str(e))

class PendingHandler(tornado.web.RequestHandler):
    def get(self):
        try:
            global game
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps({"pending": game.swap.get_pending()}))
        except Exception as e:
            logger.exception('Error retrieving pending actions')
            self.set_status(400)
            self.write(str(e))

class HistoryHandler(tornado.web.RequestHandler):
    def get(self, account):
        try:
            global game
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps({"history": game.money.get_history(account)}))
        except Exception as e:
            logger.exception('Error retrieving history')
            self.set_status(400)
            self.write(str(e))

# API server boot
if __name__ == '__main__':
    try:
        logger.info('Webserver boot')
        seed(0)

        # Associating URI handers
        static_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "contents", "client")
        urls = [
            (r'/api/game/properties/(.+)', PropertiesHandler),
            (r'/api/game/transfer', TransferHandler),
            (r'/api/game/decline', DeclineHandler),
            (r'/api/game/balance/(.+)', BalanceHandler),
            (r'/api/game/player/(.+)', PlayerInfoHandler),
            (r'/api/game/history/(.+)', HistoryHandler),
            (r'/api/game/players', PlayerHandler),
            (r'/api/game/pending', PendingHandler),
            (r'/api/board', BoardHandler),
            (r'/ws', WebSocketHandler),
            (r'/start', tornado.web.StaticFileHandler, {'path': static_path, 'default_filename': 'index.html'}),
            (r'/panel/*', tornado.web.StaticFileHandler, {'path': static_path, 'default_filename': 'index.html'}),
            (r'/(.*)', tornado.web.StaticFileHandler, {'path': static_path, 'default_filename': 'index.html'}),
        ]
        logger.info('Static files from %s' % static_path)

        # These hooks propagate events to websockets
        def do_broadcast(e):
            def f(info):
                logger.debug("broadcasting %s payload=%r" % (e, info))
                broadcast(e, payload=info)
            return f
        for e in ['transaction', 'newplayer', 'newround', 'offer', 'invoice', 'match', 'leaving']:
            EventEmitterSingleton.instance().on(e, do_broadcast(e))

        # Tornado initialization
        webServerPort = os.getenv('PORT') or 8080
        application = tornado.web.Application(urls, autoreload=True, debug=True, static_path=".")
        application.listen(webServerPort)

        # Startup
        logger.info('Webserver is listening to port %s' % webServerPort)
        tornado.ioloop.IOLoop.instance().start()

    except Exception as e:
        logger.exception('Webserver fatal error')
