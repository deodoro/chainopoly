#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import tornado.ioloop
import tornado.web
import tornado.autoreload
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

# Handlers
class Test(tornado.web.RequestHandler):
    def get(self):
        self.set_header("Content-Type", "application/json")
        self.write(json.dumps({"answer": "OK"}))

# Framework do servidor
if __name__ == "__main__":
    try:
        logger.info('Webserver boot')

        urls = [
            (r"/api/test", Test),
            (r"/api/players", Players),
            (r"/api/assets", Assets),
            (r"/api/board", Assets),
        ]

        # Iniciar servidor
        webServerPort = os.getenv('PORT') or 8080
        application = tornado.web.Application(urls)
        application.listen(webServerPort)

        # Iniciar loop de servidor
        io_loop = tornado.ioloop.IOLoop.instance()
        logger.info('Webserver is listening to port %s' % webServerPort)
        ioloop = tornado.ioloop.IOLoop.instance()
        ioloop.start()
    except Exception as e:
        logger.exception('Webserver fatal error')
