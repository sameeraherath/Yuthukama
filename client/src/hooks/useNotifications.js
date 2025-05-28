import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../features/notifications/notificationsSlice";
import io from "socket.io-client";

let socket;

export const useNotifications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?.id) return;

    if (!socket) {
      socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:5000", {
        withCredentials: true,
      });
    }

    // Authenticate socket connection with user ID
    socket.emit("authenticate", user.id);

    // Listen for new notifications
    socket.on("notification", (notification) => {
      dispatch(addNotification(notification));
    });

    return () => {
      if (socket) {
        socket.off("notification");
      }
    };
  }, [dispatch, user?.id]);

  return null; // This hook is used for its side effects only
};
