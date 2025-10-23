// src/services/notifications.js - FIXED VERSION

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export const createNotification = async (
  userId,
  complaintId,
  title,
  message
) => {
  try {
    console.log("📬 Creating notification for user:", userId);

    const notificationData = {
      userId,
      complaintId,
      title,
      message,
      read: false,
      createdAt: new Date(),
    };

    const notifRef = await addDoc(
      collection(db, "notifications"),
      notificationData
    );

    console.log("✅ Notification created:", notifRef.id);
    return { success: true, id: notifRef.id };
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    return { success: false, error: error.message };
  }
};

export const getUserNotifications = async (userId) => {
  try {
    console.log("🔍 Fetching notifications for user:", userId);

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const notifications = [];

    querySnapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() });
    });

    console.log(`✅ Fetched ${notifications.length} notifications`);
    return { success: true, notifications };
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    return { success: false, error: error.message, notifications: [] };
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    await updateDoc(doc(db, "notifications", notificationId), {
      read: true,
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: error.message };
  }
};

export const markAllNotificationsAsRead = async (userId) => {
  try {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      where("read", "==", false)
    );

    const querySnapshot = await getDocs(q);

    const updatePromises = [];
    querySnapshot.forEach((docSnapshot) => {
      updatePromises.push(
        updateDoc(doc(db, "notifications", docSnapshot.id), { read: true })
      );
    });

    await Promise.all(updatePromises);

    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, error: error.message };
  }
};
