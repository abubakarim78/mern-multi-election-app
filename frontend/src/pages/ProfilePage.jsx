import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { User, Mail, Calendar, ShieldCheck } from "lucide-react";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/elections");
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Redirecting...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You need to be logged in to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg md:max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/10 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover shadow-lg border-4 border-blue-500"
                />
                <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1.5 border-2 border-white dark:border-gray-800">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                {user.username}
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
                {user.role || "Voter"}
              </p>
            </div>

            <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                User Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <User className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Username
                    </p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Email Address
                    </p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Joined On
                    </p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;