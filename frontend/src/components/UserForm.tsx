import { useState } from "react";
import { User, Check, AlertCircle } from "lucide-react";
import { validatePartialUser, validateUser } from "../schemas/userSchema"; // Importamos el validador
import { IUserForm } from "../types";
import { useUserStore } from "../lib/store/user";
import { useSetDataUser } from "../lib/hooks/useEditUser";

export default function UserForm({ editUserId }: { editUserId?: number }) {
  const { data, imagePreview: image } = useSetDataUser({ userId: editUserId });

  const createUser = useUserStore((state) => state.addUser);
  const updateUser = useUserStore((state) => state.editUser);
  const loading = useUserStore((state) => state.loading);

  const [formData, setFormData] = useState<IUserForm>(data);
  const [imagePreview, setImagePreview] = useState<string | null>(image);

  const [errors, setErrors] = useState<any>({});
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setFormData({
        ...formData,
        profilePicture: file,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitStatus({ type: "", message: "" });
    const { password, ...restData } = formData;
    const validationErrors =
      editUserId && formData.password.length < 1
        ? validatePartialUser(restData)
        : validateUser(formData);

    if (validationErrors) {
      setErrors(validationErrors);
      setSubmitStatus({
        type: "error",
        message: "Please fix the errors in the form",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    if (editUserId && formData.password.length > 1) {
      formDataToSend.append("password", formData.password);
    }
    if (!editUserId) {
      formDataToSend.append("password", formData.password);
    }

    formDataToSend.append("phoneNumber", formData.phoneNumber || "");
    formDataToSend.append("role", formData.role);
    formDataToSend.append("status", formData.status);
    if (formData.address) {
      formDataToSend.append("address[city]", formData.address.city);
      formDataToSend.append("address[street]", formData.address.street);
      formDataToSend.append("address[number]", formData.address.number || "");
      formDataToSend.append("address[postalCode]", formData.address.postalCode);
    }
    if (formData.profilePicture) {
      formDataToSend.append("profilePicture", formData.profilePicture);
    }

    try {
      if (editUserId) {
        await updateUser(editUserId, formDataToSend);
        setSubmitStatus({
          type: "success",
          message: "User updated successfully",
        });
      } else {
        await createUser(formDataToSend);
        setSubmitStatus({
          type: "success",
          message: "User created successfully",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg">
      {submitStatus.message && (
        <div
          className={`mb-4 p-4 rounded ${
            submitStatus.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center">
            {submitStatus.type === "success" ? (
              <Check className="mr-2 h-5 w-5" />
            ) : (
              <AlertCircle className="mr-2 h-5 w-5" />
            )}
            <span>{submitStatus.message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-black">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-grow space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="w-32 row-span-2 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
                <label
                  htmlFor="profilePicture"
                  className="cursor-pointer w-full h-full flex items-center justify-center"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                </label>
                {errors.profilePicture && (
                  <p className="mt-1 text-sm text-red-600 absolute bottom-0 left-0 right-0 text-center">
                    {errors.profilePicture?._errors?.join(", ")}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName?._errors?.join(", ")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lastName?._errors?.join(", ")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email?._errors?.join(", ")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password?._errors?.join(", ")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phoneNumber?._errors?.join(", ")}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleSelectChange}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.role?._errors?.join(", ")}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.status?._errors?.join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-medium mb-4 text-gray-700">
            Address Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Street *
              </label>
              <input
                type="text"
                id="street"
                name="address.street"
                value={formData.address?.street}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.address?.street ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address?.street && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address?.street?._errors?.join(", ")}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="number"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Number
              </label>
              <input
                type="text"
                id="number"
                name="address.number"
                value={formData.address?.number}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City *
              </label>
              <input
                type="text"
                id="city"
                name="address.city"
                value={formData.address?.city}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.address?.city ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address?.city && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address?.city?._errors?.join(", ")}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Postal Code *
              </label>
              <input
                type="text"
                id="postalCode"
                name="address.postalCode"
                value={formData.address?.postalCode}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.address?.postalCode
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.address?.postalCode && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address?.postalCode?._errors?.join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            disabled={loading}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {loading ? "sending..." : "submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
