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

game_number = 0
ws = []

# Handlers
class WebSocket(tornado.websocket.WebSocketHandler):
    def open(self, game_id):
        logger.debug("WebSocket open for game_id %s" % game_id)
        if not self in ws:
            ws.append(self)
        pass

    def on_message(self, message):
        logger.debug("message: %r" % message)

    def on_close(self):
        if self in ws:
            ws.remove(ws)
        logger.debug("WebSocket closed")

class Player(tornado.web.RequestHandler):
    def get(self):
        self.set_header("Content-Type", "application/json")
        self.write(json.dumps({"answer": "OK"}))

class Asset(tornado.web.RequestHandler):
    def get(self):
        self.set_header("Content-Type", "application/json")
        self.write(json.dumps({"answer": "OK"}))

class Board(tornado.web.RequestHandler):
    def get(self):
        self.set_header("Content-Type", "application/json")
        self.write(json.dumps({"answer": "OK"}))

class Game(tornado.web.RequestHandler):
    def post(self):
        self.set_header("Content-Type", "application/json")
        self.write(json.dumps({"id": str(game_number)}))
        game_number += 1

# Framework do servidor
if __name__ == "__main__":
    try:
        logger.info('Webserver boot')

        urls = [
            (r"/api/game", Game),
            (r"/api/players", Player),
            (r"/api/assets", Asset),
            (r"/api/board", Board),
            (r"/ws/(.+)", WebSocket),
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
