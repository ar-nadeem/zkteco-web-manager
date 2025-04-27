from app.zkteko.base import ZktekoBase


class UserManager(ZktekoBase):
    """Class to handle user-related operations from ZKTeco device."""

    def __init__(self, ip: str, port: int = 4370, password: int = 0,
                 force_udp: bool = False, ommit_ping: bool = False, timeout: int = 5):
        """Initialize UserManager with device connection parameters."""
        super().__init__(ip=ip, port=port, password=password,
                         force_udp=force_udp, ommit_ping=ommit_ping, timeout=timeout)
        self.user_dict = {}

    def setup_user_dictionary(self):
        """Create a user lookup dictionary with integer keys."""
        try:
            self.connect()
            users = self.conn.get_users()
            self.user_dict = {int(user.uid): user.name for user in users}
            # Add any manual overrides
            self.user_dict[26] = 'Ali Shehzad'
            return self.user_dict
        finally:
            self.disconnect()

    def get_user_name(self, user_id: int) -> str:
        """Get user name by ID, returns 'Unknown' if not found."""
        return self.user_dict.get(user_id, 'Unknown')

    def get_all_users(self):
        """Get all users from the device."""
        try:
            self.connect()
            return self.conn.get_users()
        finally:
            self.disconnect()

    def add_user(self, uid: int, name: str, privilege: int = 0, password: str = '',
                 group_id: str = '', user_id: str = '', card: int = 0):
        """Add a new user to the device."""
        try:
            self.connect()
            self.conn.set_user(uid=uid, name=name, privilege=privilege,
                               password=password, group_id=group_id,
                               user_id=user_id, card=card)
            # Update local dictionary
            self.user_dict[uid] = name
            return True
        except Exception as e:
            print(f"Error adding user: {e}")
            return False
        finally:
            self.disconnect()

    def delete_user(self, uid: int):
        """Delete a user from the device."""
        try:
            self.connect()
            self.conn.delete_user(uid=uid)
            # Update local dictionary
            if uid in self.user_dict:
                del self.user_dict[uid]
            return True
        except Exception as e:
            print(f"Error deleting user: {e}")
            return False
        finally:
            self.disconnect()

    def update_user(self, uid: int, name: str = None, privilege: int = None,
                    password: str = None):
        """Update user information."""
        try:
            self.connect()
            # Get current user info
            users = self.conn.get_users()
            user = next((u for u in users if int(u.uid) == uid), None)

            if user:
                # Update only provided fields
                new_name = name if name is not None else user.name
                new_privilege = privilege if privilege is not None else user.privilege
                new_password = password if password is not None else user.password

                # Apply updates
                self.conn.set_user(uid=uid, name=new_name,
                                   privilege=new_privilege,
                                   password=new_password)

                # Update local dictionary
                self.user_dict[uid] = new_name
                return True
            return False
        except Exception as e:
            print(f"Error updating user: {e}")
            return False
        finally:
            self.disconnect()
