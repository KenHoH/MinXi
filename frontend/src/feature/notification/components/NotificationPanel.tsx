import { X, Bell } from "lucide-react";
import type { NotificationRes } from "@/service/api";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationRes[];
}

export function NotificationPanel({
  isOpen,
  onClose,
  notifications,
}: NotificationPanelProps) {
  const filteredNotifications = notifications.filter(
    (notif) => notif.isSeen === false
  );
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed left-20 top-0 h-full w-96 bg-black   -900 border-r border-dark-700 z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-dark-700">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-burgundy-600" />
            <h2 className="text-xl font-bold text-white">Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Bell className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">No notifications</p>
              <p className="text-gray-600 text-sm mt-2">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-dark-700">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-dark-800 transition-colors cursor-pointer ${
                    !notification.isSeen ? "bg-dark-800/50" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    {/* User Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          notification.profilePicture ||
                          "http://localhost:3000/uploads/profile/1763906830326-69740177.png"
                        }
                        alt={notification.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm text-gray-200">
                            <span className="font-semibold text-white">
                              {notification.username}
                            </span>{" "}
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Unread indicator */}
                  {!notification.isSeen && (
                    <div className="mt-2 flex justify-end">
                      <div className="w-2 h-2 bg-burgundy-600 rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-dark-700">
          <button className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors">
            Mark all as read
          </button>
        </div>
      </div>
    </>
  );
}
