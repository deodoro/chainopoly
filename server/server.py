#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import tornado.ioloop
import tornado.web
import tornado.autoreload
import tornado.websocket
import json
import logging
import os
import sys
from engine.game import Game

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

games = []
ws = []

# Handlers
class WebSocket(tornado.websocket.WebSocketHandler):
    def open(self, game_id):
        logger.debug('WebSocket open for game_id %s' % game_id)
        if not self in ws:
            ws.append(self)
        pass

    def on_message(self, message):
        logger.debug('message: %r' % message)

    def on_close(self):
        if self in ws:
            ws.remove(ws)
        logger.debug('WebSocket closed')

class Asset(tornado.web.RequestHandler):
    def get(self):
        self.set_header('Content-Type', 'application/json')
        self.write(json.dumps({'answer': 'OK'}))

class Board(tornado.web.RequestHandler):
    def get(self):
        self.set_header('Content-Type', 'application/json')
        self.write(json.dumps({'answer': 'OK'}))

class GameHandler(tornado.web.RequestHandler):
    def post(self, id = None):
        try:
            args = json.loads(self.request.body)
            new_game = Game()
            games.append(new_game)
            new_game.register_player(args['account'], args['username'])
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps({'id': len(games) - 1}))
        except Exception as e:
            logger.exception('Retrieving game #%s' % game_id)
            self.set_status(400)
            self.write('Registro inválido')

class PlayerHandler(tornado.web.RequestHandler):
    def get(self, id=-1):
        try:
            game_id = int(id)
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps(games[game_id].list_players()))
        except Exception as e:
            logger.exception('Retrieving players for game #%s' % id)
            self.set_status(400)
            self.write('Invalid game')

    def post(self, id=-1):
        try:
            args = json.loads(self.request.body)
            if games[int(id)].register_player(args['account'], args['username']):
                self.set_header('Content-Type', 'application/json')
                self.write({'result': 'Registered for game#%s' % id})
            else:
                self.set_status(400)
                self.set_header('Content-Type', 'application/json')
                self.write({'result': 'Ongoing game or already registered'})
        except Exception as e:
            logger.exception('Retrieving players for game #%s' % id)
            self.set_status(400)
            self.write('Invalid game')

# Framework do servidor
if __name__ == '__main__':
    try:
        logger.info('Webserver boot')

        urls = [
            (r'/api/game(/.+)?', GameHandler),
            (r'/api/players/(\d+)', PlayerHandler),
            (r'/api/assets', Asset),
            (r'/api/board', Board),
            (r'/ws/(.+)', WebSocket),
        ]

        # Iniciar servidor
        webServerPort = os.getenv('PORT') or 8080
        application = tornado.web.Application(urls, autoreload=True)
        application.listen(webServerPort)

        # Iniciar loop de servidor
        logger.info('Webserver is listening to port %s' % webServerPort)
        ioloop = tornado.ioloop.IOLoop.instance()
        ioloop.start()
    except Exception as e:
        logger.exception('Webserver fatal error')
