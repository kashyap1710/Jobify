import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button 
      className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
