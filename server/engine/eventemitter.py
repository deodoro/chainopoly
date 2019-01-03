import tornado.ioloop
from pyee import EventEmitter
import copy

class EventEmitterSingleton:
    __instance = None

    @staticmethod
    def instance():
        if EventEmitterSingleton.__instance == None:
            EventEmitterSingleton.__instance = EventEmitter(tornado.ioloop.IOLoop.current().asyncio_loop)
        return EventEmitterSingleton.__instance

    @staticmethod
    def inject(instance):
        EventEmitterSingleton.__instance = instance

def emit(evt, info):
    EventEmitterSingleton.instance().emit(evt, copy.deepcopy(info))
