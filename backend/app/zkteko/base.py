from zk import ZK
from zk.exception import ZKNetworkError


class ZktekoBase:
    def __init__(self, ip: str, port: int = 4370, password: int = 0, force_udp: bool = False, ommit_ping: bool = False, timeout: int = 5):
        self.ip = ip
        self.port = port
        self.password = password
        self.force_udp = force_udp
        self.ommit_ping = ommit_ping
        self.timeout = timeout
        self.zk = ZK(self.ip, port=self.port, password=self.password, force_udp=self.force_udp,
                     ommit_ping=self.ommit_ping, timeout=self.timeout)
        self.conn = None

    def connect(self) -> None:
        """Connect to the device and disable it for operations."""
        if self.conn is not None:
            return  # Already connected

        try:
            self.conn = self.zk.connect()
            if self.conn:
                self.conn.disable_device()
        except ZKNetworkError as e:
            self.conn = None
            raise ConnectionError(
                f"Failed to connect to device at {self.ip}:{self.port} - {str(e)}")
        except Exception as e:
            self.conn = None
            raise ConnectionError(
                f"Unexpected error while connecting: {str(e)}")

    def disconnect(self) -> None:
        """Safely disconnect from the device."""
        if self.conn:
            try:
                self.conn.enable_device()
                self.conn.disconnect()
            except Exception as e:
                raise ConnectionError(
                    f"Failed to disconnect from device: {str(e)}")
            finally:
                self.conn = None
