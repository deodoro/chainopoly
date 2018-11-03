import tornado.websocket
import logging
import json

logger = logging.getLogger('websocket')
ws = []

# Handlers
class WebSocketHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        logger.debug('Opening websocket')
        ws.append(self)

    def on_message(self, message):
        logger.debug('message: %r' % message)

    def on_close(self):
        ws.remove(self)
        logger.debug('WebSocket closed')

def broadcast(type, player_id = None, game_id = None, payload = None):
    for socket in ws:
        socket.write_message(json.dumps({'type': type, 'player': player_id, 'game': game_id, 'payload': payload}))
