"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  FiBookOpen,
  FiMenu,
  FiX,
  FiHelpCircle,
  FiHome,
  FiLogIn,
  FiLogOut,
  FiSearch,
  FiSettings,
  FiStar,
} from "react-icons/fi";
import AuthModal, { AuthMode } from "@/components/AuthModal";
import { auth } from "@/lib/firebase";

type SidebarIcon = React.ComponentType;

type SidebarItem =
  | {
      href: string;
      label: string;
      icon: SidebarIcon;
      type: "link";
    }
  | {
      label: string;
      icon: SidebarIcon;
      type: "disabled";
    };

const sidebarItems: SidebarItem[] = [
  {
    href: "/for-you",
    label: "For you",
    icon: FiHome,
    type: "link",
  },
  {
    href: "/library",
    label: "Library",
    icon: FiBookOpen,
    type: "link",
  },
  {
    label: "Highlights",
    icon: FiStar,
    type: "disabled",
  },
  {
    label: "Search",
    icon: FiSearch,
    type: "disabled",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: FiSettings,
    type: "link",
  },
  {
    label: "Help & Support",
    icon: FiHelpCircle,
    type: "disabled",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return unsubscribe;
  }, []);

  async function handleLogout() {
    await signOut(auth);
    setIsMobileOpen(false);
    router.push("/");
  }

  function handleLogin() {
    setAuthMode("login");
    setIsAuthModalOpen(true);
    setIsMobileOpen(false);
  }

  return (
    <>
      <button
        aria-label={isMobileOpen ? "Close sidebar" : "Open sidebar"}
        className="app-sidebar__toggle"
        onClick={() => setIsMobileOpen((isOpen) => !isOpen)}
        type="button"
      >
        {isMobileOpen ? <FiX /> : <FiMenu />}
      </button>

      <button
        aria-label="Close sidebar menu"
        className={`app-sidebar__overlay ${
          isMobileOpen ? "app-sidebar__overlay--open" : ""
        }`}
        onClick={() => setIsMobileOpen(false)}
        type="button"
      />

      <aside
        className={`app-sidebar ${
          isMobileOpen ? "app-sidebar--mobile-open" : ""
        }`}
      >
        <Link
          className="app-sidebar__logo"
          href="/for-you"
          onClick={() => setIsMobileOpen(false)}
        >
          <Image src="/assets/logo.png" alt="Summarist" width={180} height={55} />
        </Link>

        <nav className="app-sidebar__nav" aria-label="Application navigation">
          <div className="app-sidebar__group">
            {sidebarItems.map((item) =>
              item.type === "link" ? (
                <SidebarLink
                  href={item.href}
                  icon={item.icon}
                  isActive={pathname === item.href}
                  key={item.label}
                  label={item.label}
                  onNavigate={() => setIsMobileOpen(false)}
                />
              ) : (
                <SidebarDisabledItem
                  icon={item.icon}
                  key={item.label}
                  label={item.label}
                />
              )
            )}
          </div>
        </nav>

        <div className="app-sidebar__bottom">
          {isLoggedIn ? (
            <button
              className="app-sidebar__link"
              onClick={handleLogout}
              type="button"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          ) : (
            <button
              className="app-sidebar__link"
              onClick={handleLogin}
              type="button"
            >
              <FiLogIn />
              <span>Login</span>
            </button>
          )}
        </div>
      </aside>

      <AuthModal
        isOpen={isAuthModalOpen}
        mode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onModeChange={setAuthMode}
        successRedirectUrl={null}
      />
    </>
  );
}

type SidebarLinkProps = {
  href: string;
  label: string;
  icon: SidebarIcon;
  isActive: boolean;
  onNavigate: () => void;
};

function SidebarLink({
  href,
  label,
  icon: Icon,
  isActive,
  onNavigate,
}: SidebarLinkProps) {
  return (
    <Link
      className={`app-sidebar__link ${
        isActive ? "app-sidebar__link--active" : ""
      }`}
      href={href}
      onClick={onNavigate}
    >
      <Icon />
      <span>{label}</span>
    </Link>
  );
}

type SidebarDisabledItemProps = {
  label: string;
  icon: SidebarIcon;
};

function SidebarDisabledItem({ label, icon: Icon }: SidebarDisabledItemProps) {
  return (
    <div className="app-sidebar__link app-sidebar__link--disabled">
      <Icon />
      <span>{label}</span>
    </div>
  );
}
