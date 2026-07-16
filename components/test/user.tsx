import { useUserStore } from "@/components/stores/userStore";

export default function Test() {
  const { user, setUser } = useUserStore();

  return (
    <div>
      <h1>Store Test</h1>

      <p>
        User: {user ? user.name : "No User"}
      </p>

      <button
        onClick={() =>
          setUser({ name: "Alex" })
        }
      >
        Login
      </button>

      <button
        onClick={() =>
          setUser(null)
        }
      >
        Logout
      </button>
    </div>
  );
}