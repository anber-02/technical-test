import { useState } from "react";
import { UsersList } from "../../components/UserList";
import { SearchBar } from "../../components/Search";
import { CustomModal } from "../../components/Modal";
import UserForm from "../../components/UserForm";

export function Home() {
  const [filters, setFilters] = useState({
    role: "",
    status: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState<number | undefined>();

  const editUser = (id: number) => {
    setUserId(id);
    setOpenModal(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      <div className="p-6 ">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <SearchBar onSearch={handleSearch} />

          <select
            value={filters.role}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, role: e.target.value }))
            }
            className="transition-all duration-300 ease-in-out px-4 py-2 w-64 text-black border border-gray-300 rounded-md"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="transition-all duration-300 ease-in-out px-4 py-2 w-64 text-black border border-gray-300 rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <button
            onClick={() => {
              setUserId(undefined);
              setOpenModal(true);
            }}
            className="border-2 bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-md transition-all duration-300 ease-in-out"
          >
            Add user
          </button>
        </div>

        <UsersList
          filters={{ ...filters, search: searchQuery }}
          editUser={editUser}
        />
      </div>
      <CustomModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title={userId ? "Edit User" : "Add User"}
      >
        <UserForm editUserId={userId} />
      </CustomModal>
    </>
  );
}
