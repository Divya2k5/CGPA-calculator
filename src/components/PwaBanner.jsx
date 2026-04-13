import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function getIsStandalone() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

export default function PwaBanner() {
  const location = useLocation();
  const [installEvent, setInstallEvent] = useState(null);
  const [isStandalone, setIsStandalone] = useState(getIsStandalone);
  const [isOnline, setIsOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleDisplayModeChange = () => setIsStandalone(getIsStandalone());
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallEvent(event);
      setDismissed(false);
    };
    const handleAppInstalled = () => {
      setInstallEvent(null);
      setDismissed(true);
      setIsStandalone(true);
    };
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    mediaQuery.addEventListener?.("change", handleDisplayModeChange);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      mediaQuery.removeEventListener?.("change", handleDisplayModeChange);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isStandalone) {
    return null;
  }

  const showInstallPrompt = Boolean(installEvent) && !dismissed;
  const showOfflineNotice = !isOnline;

  if (!showInstallPrompt && !showOfflineNotice) {
    return null;
  }

  const handleInstall = async () => {
    if (!installEvent) {
      return;
    }

    installEvent.prompt();
    const outcome = await installEvent.userChoice.catch(() => null);
    setInstallEvent(null);

    if (outcome?.outcome === "dismissed") {
      setDismissed(true);
    }
  };

  const bottomOffset = location.pathname === "/login" ? "bottom-4" : "bottom-24";

  return (
    <div className={`pointer-events-none fixed inset-x-0 ${bottomOffset} z-40 px-4 md:bottom-6`}>
      <div className="mx-auto max-w-2xl">
        <div className="pointer-events-auto flex flex-col gap-4 rounded-[28px] border border-white/10 bg-[#111a2f]/96 p-4 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#f3f6ff]">
              {showOfflineNotice ? "You are offline" : "Install the app"}
            </p>
            <p className="mt-1 text-sm leading-6 text-[#8c909f]">
              {showOfflineNotice
                ? "Previously loaded screens still open, but sign-in and live syncing need a connection."
                : "Install the calculator for a full-screen experience and faster repeat visits."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {showInstallPrompt ? (
              <button type="button" className="primary-button !min-h-0 !w-auto justify-center px-4 py-3" onClick={handleInstall}>
                Install
              </button>
            ) : null}
            <button type="button" className="secondary-button !min-h-0 !w-auto justify-center px-4 py-3" onClick={() => setDismissed(true)}>
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
