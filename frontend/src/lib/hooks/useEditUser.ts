import { useUserStore } from "../store/user";
import { IUserForm } from "../../types";

const INITIAL_FORM: IUserForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phoneNumber: "",
  role: "USER",
  status: "ACTIVE",
  address: {
    street: "",
    number: "",
    city: "",
    postalCode: "",
  },
};

export function useSetDataUser({ userId }: { userId: number | undefined }) {
  const imagePreview = "";
  const users = useUserStore((state) => state.users);

  if (!userId)
    return {
      data: INITIAL_FORM,
      imagePreview,
    };

  const userToEdit = users.find((user) => user.id === userId);

  if (!userToEdit) return { data: INITIAL_FORM, imagePreview };

  return {
    data: {
      firstName: userToEdit.firstName,
      lastName: userToEdit.lastName,
      email: userToEdit.email,
      password: "",
      phoneNumber: userToEdit.phoneNumber || "",
      role: userToEdit.role,
      status: userToEdit.status,
      address: userToEdit.address && {
        street: userToEdit.address.street,
        number: userToEdit.address.number || "",
        city: userToEdit.address.city,
        postalCode: userToEdit.address.postalCode,
      },
    },
    imagePreview: userToEdit.profilePictureUrl || null,
  };
}
