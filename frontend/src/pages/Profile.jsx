import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="section-heading mb-8 text-center">Your Profile</h1>

      <div className="card space-y-4">
        <div>
          <p className="font-body text-sm text-taupe">Full Name</p>
          <p className="font-body text-ink text-lg">{user?.name}</p>
        </div>
        <div className="border-t border-sand pt-4">
          <p className="font-body text-sm text-taupe">Email</p>
          <p className="font-body text-ink text-lg">{user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
