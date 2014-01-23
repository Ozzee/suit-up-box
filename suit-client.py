import logging
from threading import Thread
from socketIO_client import SocketIO

# Server settings
host        =  'localhost'
port        =  3000

# Personal identity
identity    =  'Oskar'

logging.basicConfig(level=logging.WARNING)


class SuitUp():

    def __init__(self, socketIO):
        self.socketIO = socketIO

    def print_msg(self, args):
        print 'Received: ', args

    def receive_messages(self):
        self.socketIO.on('message', self.print_msg)
        while (True):
            self.socketIO.wait()

    def send_messages(self):
        message = ''
        while( message != "exit"):
            self.socketIO.emit('message', message)
            message = raw_input('Message: ')


if __name__ == "__main__":
    socketIO = SocketIO(host, port)

    Box = SuitUp(socketIO)
    
    socketIO.emit('identify', 'Oskar')

    thread = Thread(target = Box.receive_messages)
    thread2 = Thread(target = Box.send_messages)
    thread.start()
    thread2.start()
    #thread.join()