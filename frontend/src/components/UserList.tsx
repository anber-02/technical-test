import { useState } from "react";
import { useGetUsers } from "../lib/hooks/useUserActions";

interface Props {
  editUser: (id: number) => void;
  filters: filters;
}

interface filters {
  search?: string;
  role?: string;
  status?: string;
}

export function UsersList({ editUser, filters }: Props) {
  const { loading, pagination, removeUser, setCurrentPage, users } =
    useGetUsers(filters);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userIdToRemove, setUserIdToRemove] = useState<number | null>(null);

  const openDialog = (id: number) => {
    setUserIdToRemove(id);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setUserIdToRemove(null);
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-medium mb-4 text-black">
              Are you sure you want to delete this user?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={() => {
                  if (userIdToRemove !== null) {
                    removeUser(userIdToRemove);
                  }
                  closeDialog();
                }}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={closeDialog}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="text-center text-gray-600 mt-6">No results</div>
      )}

      <table width="100%" className="text-black">
        <thead className="text-zinc-800">
          <tr>
            <th>Picture</th>
            <th className="pointer cursor-pointer">Name</th>
            <th className="pointer">Email</th>
            <th className="pointer">Phone Number</th>
            <th className="pointer">Role</th>
            <th className="pointer">Status</th>
            <th className="w-auto">Actions</th>
          </tr>
        </thead>

        <tbody className="">
          {users.map((user) => {
            return (
              <tr key={user.email} className="">
                <td className="py-2 px-2">
                  {user.profilePictureUrl && (
                    <img
                      src={user.profilePictureUrl!}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                </td>
                <td className="py-2">{user.firstName}</td>
                <td className="py-2">
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td className="py-2">{user.phoneNumber || "-"}</td>
                <td className="py-2">{user.role}</td>
                <td className="py-2">
                  {user.status === "ACTIVE" ? (
                    <span className="rounded-full px-2 py-0.5 bg-green-600 text-white">
                      {user.status}
                    </span>
                  ) : (
                    <span className="rounded-full px-2 py-0.5 bg-gray-600 text-white">
                      {user.status}
                    </span>
                  )}
                </td>
                <td className="py-2  flex justify-center gap-2">
                  <button
                    className="bg-red-400 rounded-md py-1 px-2 text-white"
                    onClick={() => {
                      openDialog(user.id);
                    }}
                  >
                    Borrar
                  </button>
                  <button
                    className="bg-blue-400 rounded-md py-1 px-2 text-white"
                    onClick={() => {
                      editUser(user.id);
                    }}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-center mt-6 gap-2">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
          disabled={!pagination.hasPreviousPage}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
          disabled={!pagination.hasNextPage}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
}
