"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const page = () => {
  const { data: session, status: sessionStatus } = useSession();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (session?.user && sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const inputChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      setError("Email is invalid");
      return;
    }

    if (!formData.password || formData.password.length < 8) {
      setError("Password is invalid");
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        setError("Invalid email or password");
        if (res?.url) router.replace("/");
      } else {
        setError("");
      }
    } catch (error) {
      alert("Something went wrong, try again!");
      console.log(error);
    }
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      {sessionStatus !== "authenticated" && (
        <div className="justify-center mt-16">
          <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-lg">
            <h1 className="text-3xl font-semibold text-center text-purple-700">
              Login
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">
                  <span className="text-base label-text">Email</span>
                </label>
                <input
                  type="text"
                  placeholder="Email Address"
                  required
                  className="w-full input input-bordered input-primary"
                  name="email"
                  value={formData.email}
                  onChange={inputChange}
                />
              </div>
              <div>
                <label className="label">
                  <span className="text-base label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  required
                  className="w-full input input-bordered input-primary"
                  name="password"
                  value={formData.password}
                  onChange={inputChange}
                />
              </div>
              <a
                href="#"
                className="text-xs text-gray-600 hover:underline hover:text-blue-600"
              >
                Forget Password?
              </a>
              <div>
                <button type="submit" className="btn btn-primary">
                  Sign In
                </button>
                <p className="text-red-600 text-[16px] mb-4">
                  {error && error}
                </p>
              </div>
            </form>
            <Link
              className="block mt-2 text-center text-blue-500 hover:underline"
              href="/register"
            >
              Register Here
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
export default page;
