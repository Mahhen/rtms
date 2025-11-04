"use client"
import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, X } from "lucide-react"
import { verifyJwtToken } from '@/lib/auth';

interface JWTPayload {
  user_id: string
  email: string
  [key: string]: any
}

interface UserData {
  user_id: string
  user_name: string
  user_mobile: string
  user_email: string
  user_address: string
  login: {
    login_id: string
    login_username: string
    login_password_hash: string
    role: {
      role_id: string
      role_name: string
      role_desc: string
    }
  }
}

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })

  // ✅ Decode JWT and fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No token found")

        const decoded = await verifyJwtToken(token)
        if (!decoded.email) throw new Error("Invalid token")

        const res = await fetch(`/api/userprofile?email=${decoded.email}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Failed to load user")
        const data = await res.json()
        setUser(data)
      } catch (err: any) {
        alert("Error: " + err.message)
      }
    }
    fetchUser()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (!user) return
    if (name === "username") {
      setUser(prev => prev ? { ...prev, login: { ...prev.login, login_username: value, role: prev.login.role } } : null)
    } else {
      setUser(prev => prev ? { ...prev, [name]: value } as UserData : null)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!user) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/userprofile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(user),
      })
      if (!res.ok) throw new Error("Update failed")
      setIsEditing(false)
      alert("Profile updated successfully")
    } catch (err: any) {
      alert("Error: " + err.message)
    }
  }

  const handleSavePassword = async () => {
    if (!user) return
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      alert("Please fill all password fields")
      return
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("New passwords do not match")
      return
    }
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/userprofile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          user_id: user.user_id,
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Password change failed")

      setPasswordData({ oldPassword: "", newPassword: "", confirmNewPassword: "" })
      setShowChangePasswordPopup(false)
      alert("Password updated successfully")
    } catch (err: any) {
      alert("Error: " + err.message)
    }
  }

  if (!user) {
    return <div className="p-6 text-gray-500">Loading profile...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      <h2 className="text-2xl font-bold mb-6">Passenger Profile</h2>

      <Card className="w-full max-w-lg rounded-2xl shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Profile Details
          </CardTitle>
          {!isEditing && (
            <Button variant="outline" className="text-sm" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label className="text-gray-500 text-sm">Username</label>
                <Input name="username" value={user.login.login_username} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-gray-500 text-sm">Customer Name</label>
                <Input name="user_name" value={user.user_name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-gray-500 text-sm">Email</label>
                <Input name="user_email" value={user.user_email} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-gray-500 text-sm">Mobile Number</label>
                <Input name="user_mobile" value={user.user_mobile} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-gray-500 text-sm">Address</label>
                <Input name="user_address" value={user.user_address} onChange={handleChange} />
              </div>

              {/* Always masked password in edit */}
              <div className="flex flex-col justify-between border-b pb-2">
                <div className="flex flex-row justify-between items-center mt-1 mb-4">
                  <span className="text-gray-500">Password</span>
                  <Input
                    type="password"
                    value="********"
                    readOnly
                    className="select-none pointer-events-none"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => setShowChangePasswordPopup(true)}
                  className="mt-4 w-full bg-black text-white py-2 px-4"
                >
                  Change Password
                </Button>
              </div>

              <Button className="mt-4 w-full bg-black text-white" onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Username</span>
                <span className="text-gray-800 font-medium">{user.login.login_username}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Customer Name</span>
                <span className="text-gray-800 font-medium">{user.user_name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-800 font-medium">{user.user_email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Mobile Number</span>
                <span className="text-gray-800 font-medium">{user.user_mobile}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Address</span>
                <span className="text-gray-800 font-medium">{user.user_address}</span>
              </div>

              {/* Always masked password in profile */}
              <div className="flex flex-row justify-start border-b pb-2">
                <span className="text-gray-500 mr-40">Password</span>
                <input
                  type="password"
                  value="********"
                  readOnly
                  className="text-gray-800 font-medium bg-transparent select-none pointer-events-none w-[200px] pl-20"
                />
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Role</span>
                <span className="text-gray-800 font-medium">
                  {user.login.role.role_name} ({user.login.role.role_desc})
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {showChangePasswordPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
            <button className="absolute top-4 right-4 text-gray-500" onClick={() => setShowChangePasswordPopup(false)}>
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <div className="space-y-3">
              {/* Password change form stays same */}
              <div className="space-y-1 flex items-center">
                <label className="text-gray-500 text-sm w-32">Old Password</label>
                <Input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} />
              </div>
              <div className="space-y-1 flex items-center">
                <label className="text-gray-500 text-sm w-32">New Password</label>
                <Input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} />
              </div>
              <div className="space-y-1 flex items-center">
                <label className="text-gray-500 text-sm w-32">Confirm Password</label>
                <Input type="password" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} />
              </div>

              <Button className="mt-4 w-full bg-black text-white" onClick={handleSavePassword}>
                Save Password
              </Button>
              <Button
                variant="ghost"
                className="w-full text-gray-500 mt-2"
                onClick={() => setShowChangePasswordPopup(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {!isEditing && (
        <p className="text-gray-500 text-sm mt-4">
          Update your personal details to keep your bookings accurate.
        </p>
      )}
    </div>
  
  )
}
