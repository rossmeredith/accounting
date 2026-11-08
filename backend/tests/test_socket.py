import socket

import pytest
from pytest_socket import SocketBlockedError


def test_outbound_sockets_are_blocked():
    with pytest.raises(SocketBlockedError):
        socket.create_connection(("1.1.1.1", 80), timeout=0.1)
