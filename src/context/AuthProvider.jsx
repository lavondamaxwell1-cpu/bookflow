import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";

const defaultUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@bookflow.com",
    password: "admin123",
    phone: "",
    role: "admin",
  },
];

function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("bookflowUsers");

    if (savedUsers) {
      return JSON.parse(savedUsers);
    }

    return defaultUsers;
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("bookflowUser");

    if (savedUser) {
      return JSON.parse(savedUser);
    }

    return null;
  });

  useEffect(() => {
    localStorage.setItem("bookflowUsers", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("bookflowUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("bookflowUser");
    }
  }, [user]);

  const register = ({ name, email, password }) => {
    const existingUser = users.find(
      (savedUser) => savedUser.email.toLowerCase() === email.toLowerCase(),
    );

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      phone: "",
      role: "customer",
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);

    setUser({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    });

    return { success: true };
  };

  const login = ({ email, password }) => {
    const matchingUser = users.find(
      (savedUser) =>
        savedUser.email.toLowerCase() === email.toLowerCase() &&
        savedUser.password === password,
    );

    if (!matchingUser) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    setUser({
      id: matchingUser.id,
      name: matchingUser.name,
      email: matchingUser.email,
      phone: matchingUser.phone || "",
      role: matchingUser.role,
    });

    return { success: true, role: matchingUser.role };
  };

  const updateProfile = (profileData) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
    };

    setUser(updatedUser);

    setUsers((prevUsers) =>
      prevUsers.map((savedUser) =>
        savedUser.id === user.id
          ? {
              ...savedUser,
              name: profileData.name,
              email: profileData.email,
              phone: profileData.phone,
            }
          : savedUser,
      ),
    );
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    users,
    register,
    login,
    logout,
    updateProfile,
    isLoggedIn: Boolean(user),
    isAdmin: user?.role === "admin",
    isCustomer: user?.role === "customer",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
