
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { User, Upload, Save } from "lucide-react";

const ProfilePage = () => {
  const { userProfile, updateProfile } = useAuth();
  const [name, setName] = useState(userProfile?.name || "");
  const [email, setEmail] = useState(userProfile?.email || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      updateProfile({ name, email });
      setIsSaving(false);
      toast.success("Profile updated successfully!", {
        duration: 3000,
      });
    }, 1000);
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    // Convert file to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      updateProfile({ profilePicture: reader.result as string });
      setIsUploading(false);
      toast.success("Profile picture updated!");
    };
    reader.readAsDataURL(file);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 animate-fade-in [animation-delay:200ms]">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Click on the avatar to update your profile picture</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div 
              className="relative cursor-pointer group transition-all mb-4" 
              onClick={handleImageClick}
            >
              <Avatar className="h-32 w-32 border-4 border-white shadow-md hover:shadow-lg transition-all">
                <AvatarImage src={userProfile?.profilePicture} />
                <AvatarFallback className="text-xl bg-blue-500 text-white">
                  {userProfile?.name ? getInitials(userProfile.name) : <User />}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <Upload className="text-white h-6 w-6" />
              </div>
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="animate-spin h-6 w-6 border-2 border-white rounded-full border-t-transparent"></div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <p className="text-sm text-gray-500 text-center">
              Click to upload a new image<br />
              (Max size: 5MB)
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 animate-fade-in [animation-delay:400ms]">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-all"
                />
              </div>
              <Button 
                type="submit" 
                className="mt-4 transition-all"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
