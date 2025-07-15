import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FixDemoProfile() {
  const navigate = useNavigate();

  useEffect(() => {
    // Create the missing demo profile
    const demoProfile = {
      id: "demo-user-123",
      name: "Dr. Demo User",
      email: "demo@doctor.com",
      created_at: new Date().toISOString(),
    };

    localStorage.setItem("demo-user-profile", JSON.stringify(demoProfile));

    // Also set demo session if not exists
    const demoSession = {
      id: "demo-user-123",
      email: "demo@doctor.com",
      user_metadata: { name: "Dr. Demo User" },
      created_at: new Date().toISOString(),
    };

    localStorage.setItem("demo-session", JSON.stringify(demoSession));

    console.log("Demo profile fixed!");
    alert("Demo profile has been created successfully. You can now log in.");

    // Redirect to login
    navigate("/login");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Fixing Demo Profile...</h1>
        <p>Please wait while we set up your demo profile.</p>
      </div>
    </div>
  );
}
