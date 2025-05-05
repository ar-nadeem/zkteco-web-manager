import React, { useState, useMemo } from "react";
import { UsersDisplayProps } from "../types/user";
import { userAPI } from "../apiHandler/calls";
import { User } from "../types/user";

const UserDisplay: React.FC<UsersDisplayProps> = ({
  data,
  isLoading,
  error,
  deviceSettings,
  onRefresh,
}) => {
  const [nameFilter, setNameFilter] = useState<string>("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState<User>({
    uid: 0,
    name: "",
    privilege: 0,
    password: "",
    group_id: "",
    user_id: "",
    card: 0,
  });

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((user) => {
      // Name filter
      return (
        !nameFilter ||
        user.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    });
  }, [data, nameFilter]);

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleSave = async () => {
    if (!editingUser || !deviceSettings) return;

    setIsUpdating(true);
    setUpdateError(null);

    try {
      await userAPI.updateUser(deviceSettings, editingUser);
      setEditingUser(null);
      onRefresh?.(); // Refresh the user list after successful update
    } catch (err) {
      setUpdateError(
        err instanceof Error ? err.message : "Failed to update user"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setUpdateError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingUser) return;

    const { name, value } = e.target;
    setEditingUser({
      ...editingUser,
      [name]:
        name === "privilege" || name === "card" || name === "uid"
          ? parseInt(value)
          : value,
    });
  };

  const handleDelete = async (user: User) => {
    if (!deviceSettings) return;

    if (!window.confirm(`Are you sure you want to delete user ${user.name}?`)) {
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);

    try {
      await userAPI.deleteUser(deviceSettings, user);
      onRefresh?.();
    } catch (err) {
      setUpdateError(
        err instanceof Error ? err.message : "Failed to delete user"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddUser = async () => {
    if (!deviceSettings) return;

    setIsUpdating(true);
    setUpdateError(null);

    try {
      await userAPI.addUser(deviceSettings, newUser);
      setIsAddingUser(false);
      setNewUser({
        uid: 0,
        name: "",
        privilege: 0,
        password: "",
        group_id: "",
        user_id: "",
        card: 0,
      });
      onRefresh?.();
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "Failed to add user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNewUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]:
        name === "privilege" || name === "card" || name === "uid"
          ? parseInt(value)
          : value,
    });
  };

  const handleAddUserClick = () => {
    if (!data || data.length === 0) {
      // If no users exist, start with 1
      setNewUser({
        ...newUser,
        uid: 1,
        user_id: "1",
      });
    } else {
      // Find the highest UID and User ID
      const highestUid = Math.max(...data.map((user) => user.uid));
      const highestUserId = Math.max(
        ...data.map((user) => parseInt(user.user_id) || 0)
      );

      setNewUser({
        ...newUser,
        uid: highestUid + 1,
        user_id: (highestUserId + 1).toString(),
      });
    }
    setIsAddingUser(true);
  };

  if (isLoading) {
    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse flex justify-center items-center">
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
        <div className="text-gray-500">No users found.</div>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Users</h3>
        <div className="space-x-2">
          <button
            onClick={handleAddUserClick}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Add User
          </button>
          <button
            onClick={onRefresh}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {isAddingUser && (
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <h4 className="text-md font-semibold mb-2">Add New User</h4>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="uid"
              value={newUser.uid}
              onChange={handleNewUserInputChange}
              placeholder="UID"
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              name="user_id"
              value={newUser.user_id}
              onChange={handleNewUserInputChange}
              placeholder="User ID"
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleNewUserInputChange}
              placeholder="Name"
              className="px-3 py-2 border rounded"
            />
            <input
              type="number"
              name="privilege"
              value={newUser.privilege}
              onChange={handleNewUserInputChange}
              placeholder="Privilege"
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              name="group_id"
              value={newUser.group_id}
              onChange={handleNewUserInputChange}
              placeholder="Group ID"
              className="px-3 py-2 border rounded"
            />
            <input
              type="number"
              name="card"
              value={newUser.card}
              onChange={handleNewUserInputChange}
              placeholder="Card"
              className="px-3 py-2 border rounded"
            />
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleNewUserInputChange}
              placeholder="Password"
              className="px-3 py-2 border rounded"
            />
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleAddUser}
              disabled={isUpdating}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isUpdating ? "Adding..." : "Add User"}
            </button>
            <button
              onClick={() => setIsAddingUser(false)}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search by Name
        </label>
        <input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Search by name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {updateError && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {updateError}
        </div>
      )}

      <div className="overflow-x-auto max-h-[600px] border border-gray-200 rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                UID
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                User ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Privilege
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Group ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Card
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user, index) => (
              <tr
                key={user.user_id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {editingUser?.uid === user.uid ? (
                  <>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        name="uid"
                        value={editingUser.uid}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        name="user_id"
                        value={editingUser.user_id}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        name="name"
                        value={editingUser.name}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        name="privilege"
                        value={editingUser.privilege}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        name="group_id"
                        value={editingUser.group_id}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        name="card"
                        value={editingUser.card}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="space-x-2">
                        <button
                          onClick={handleSave}
                          disabled={isUpdating}
                          className="mr-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                        >
                          {isUpdating ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {user.uid}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {user.user_id}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {user.privilege}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {user.group_id}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {user.card}
                    </td>
                    <td className="px-4 py-2">
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDisplay;
