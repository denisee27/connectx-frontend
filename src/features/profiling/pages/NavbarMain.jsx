import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { CalendarDays, LayoutDashboard, UserRound } from "lucide-react";
import { useAuthStore } from "../../auth/stores/authStore";

export default function NavbarMain({ user, onCreateEvent }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const onDocClick = (e) => {
      if (open && popRef.current && !popRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const handleCreate = () => {
    navigate("/home/new-event");
  };

  return (
    <nav className="sticky top-0 z-30 w-full backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
        {/* Left: navigation */}
        <div className="flex items-center md:gap-6 gap-1 ">
          <NavItem to="/home/schedule" end icon={<CalendarDays size={18} />} label="Schedule" />
          <NavItem to="/home" end icon={<LayoutDashboard size={18} />} label="Dashboard" />
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleCreate}
            className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            Create Event
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={open}
            className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-tr from-primary to-secondary p-1.5 text-white shadow-sm ring-1 ring-white/20 transition-transform duration-200 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span className="grid h-7 w-7 place-items-center rounded-fulltext-lg">
              <UserRound />
            </span>
          </button>

          {/* Dropdown */}
          <div
            ref={popRef}
            className={`absolute right-1 top-17 w-72 origin-top-right rounded-2xl  bg-muted-foreground p-3 text-white shadow-2xl transition-all duration-200 ${open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
              }`}
          >
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-tr from-primary to-secondary text-lg">
                <UserRound />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user?.name || "Guest User"}</p>
                <p className="truncate text-xs text-gray-300">{user?.email || "guest@example.com"}</p>
              </div>
            </div>
            <div className="mt-2">
              <DropItem label="My Profile" onClick={() => { navigate("/home/profile"), setOpen(false) }} />
              <DropItem label="Settings" onClick={() => { navigate("/home/setting"), setOpen(false) }} />
              <DropItem label="Logout" onClick={() => { setShowLogoutConfirm(true), setOpen(false) }} />
            </div>
          </div>
        </div>
      </div>
      {showLogoutConfirm && (
        <ConfirmLogoutModal
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={async () => {
            try {
              await logout();
            } finally {
              navigate("/");
            }
          }}
        />
      )}
    </nav>
  );
}

function NavItem({ to, icon, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `cursor-pointer inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm transition-colors duration-200 ${isActive
          ? "text-gray-900 underline underline-offset-4 decoration-2"
          : "text-gray-400 hover:text-gray-700"
        }`
      }
    >
      <span>{icon}</span>
      <span className="md:block hidden">{label}</span>
    </NavLink >
  );
}

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  end: PropTypes.bool,
};

function DropItem({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-gray-200 transition-colors duration-200 hover:bg-white/5 hover:text-white"
    >
      <span>{label}</span>
      <span className="text-xs text-gray-400">›</span>
    </button>
  );
}

DropItem.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

NavbarMain.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  onCreateEvent: PropTypes.func,
};

/**
 * Confirm Logout Modal with overlay, ESC, outside click, and fade transitions
 */
function ConfirmLogoutModal({ onCancel, onConfirm }) {
  const [visible, setVisible] = useState(true); // for fade-in/out
  const panelRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(() => onCancel?.(), 180); // wait for fade-out
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-[1000] ${visible ? "opacity-100" : "opacity-0"} transition-opacity duration-200`}
    >
      {/* Overlay (click to close) */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onMouseDown={close}
      />

      {/* Centered panel */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <div
          ref={panelRef}
          onMouseDown={(e) => e.stopPropagation()}
          className={`w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-xl transition-all duration-200 ${visible ? "scale-100 translate-y-0" : "scale-95 translate-y-1"}`}
        >
          <h3 className="text-lg font-semibold">Konfirmasi Logout</h3>
          <p className="mt-1 text-sm text-muted-foreground">Apakah Anda yakin ingin logout?</p>

          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={close}
              className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

ConfirmLogoutModal.propTypes = {
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};