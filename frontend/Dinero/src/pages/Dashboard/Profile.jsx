// src/pages/Dashboard/Profile.jsx

import React, { useState, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/UserContext";
import Input from "../../components/layouts/Inputs/Input";
import ProfilePhotoSelector from "../../components/layouts/Inputs/ProfilePhotoSelector";
import uploadImage from "../../utils/uploadImage";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const Profile = () => {
  useUserAuth();
  const { user, updateUser } = useContext(UserContext);

  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profileImageUrl = user.profileImageUrl;

      // If a new profile picture was selected, upload it first
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl;
      }

      // Then, call the update profile endpoint
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        fullName,
        profileImageUrl,
      });

      // Update the user context with the new data
      updateUser(response.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Profile">
      <div className="my-5 mx-auto max-w-lg">
        <div className="card">
          <h5 className="text-lg font-semibold mb-6">Edit Profile</h5>
          <form onSubmit={handleUpdateProfile}>
            <ProfilePhotoSelector
              image={profilePic}
              setImage={setProfilePic}
              // Show the existing user image by default
              defaultPreview={user?.profileImageUrl}
            />
            <Input
              label="Full Name"
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              type="text"
            />
            <Input
              label="Email Address"
              value={user?.email || ""}
              type="text"
              // Make email read-only
              disabled
            />
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="add-btn add-btn-fill"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
