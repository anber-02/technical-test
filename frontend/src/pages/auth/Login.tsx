import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../lib/store/auth";

export function Login() {
  const navigate = useNavigate();

  const handleAuthentication = useAuthStore(
    (state) => state.handleAuthentication
  );
  const error = useAuthStore((state) => state.error);
  const loading = useAuthStore((state) => state.loading);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget; // -> recuperamos el formulario
    const elements = form.elements; // -> recuperamos los elementos

    const email = elements.namedItem("email");
    const password = elements.namedItem("password");
    const isInputs =
      email instanceof HTMLInputElement && password instanceof HTMLInputElement;
    if (!isInputs) return;

    const data = { email: email.value, password: password.value };

    handleAuthentication(data.email, data.password).then(() =>
      navigate("/dashboard/home")
    );
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900 ">
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-20 rounded-md h-auto w-80 p-4 px-4 flex flex-col gap-3 items-center"
      >
        <h1 className="text-xl mb-4 font-bold text-black">Login</h1>
        <div className="flex flex-col gap-3 text-white mx-4">
          <input
            name="email"
            required
            type="email"
            placeholder="Email"
            className="w-72 rounded-sm my-2  border-0 outline-none px-3 py-1 bg-black bg-opacity-20"
          />
          <input
            name="password"
            required
            type="password"
            placeholder="Password"
            className="rounded-sm border-0  my-2 px-3 py-1 bg-black bg-opacity-20"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {/* <div className="h-6 w-6 rounded-full bg-none border-2 border-t-red-300 animate-spin"></div> */}
          <button
            type="submit"
            disabled={loading}
            className=" bg-gradient-to-r from-indigo-500 to-purple-500 py-2 rounded-sm font-semibold text-lg tracking-wide cursor-pointer active:border-white active:border-2  transition duration-500 ease-in-out hover:from-indigo-500 hover:to-pink-500 "
          >
            <span className="text-white">
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </span>
          </button>
          {/* <input
            type="submit"
            value={"Enviar"}
          /> */}
        </div>
      </form>
    </div>
  );
}
