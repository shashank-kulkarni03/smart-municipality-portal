// src/services/complaints.js - FIXED VERSION

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export const createComplaint = async (complaintData) => {
  try {
    const complaintRef = await addDoc(collection(db, "complaints"), {
      ...complaintData,
      status: "pending",
      assignedOfficer: null,
      officerName: null,
      statusHistory: [
        {
          status: "pending",
          updatedBy: complaintData.citizenId,
          updatedAt: new Date(),
          note: "Complaint submitted",
        },
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      resolvedAt: null,
    });

    return { success: true, id: complaintRef.id };
  } catch (error) {
    console.error("Error creating complaint:", error);
    return { success: false, error: error.message };
  }
};

export const getComplaints = async (filters = {}) => {
  try {
    let complaintsQuery;

    // If no filters, get ALL complaints
    if (Object.keys(filters).length === 0) {
      complaintsQuery = query(
        collection(db, "complaints"),
        orderBy("createdAt", "desc")
      );
    } else {
      // Build query with filters
      const constraints = [];

      if (filters.citizenId) {
        constraints.push(where("citizenId", "==", filters.citizenId));
      }

      if (filters.officerId) {
        constraints.push(where("assignedOfficer", "==", filters.officerId));
      }

      if (filters.region) {
        constraints.push(where("region", "==", filters.region));
      }

      if (filters.status) {
        constraints.push(where("status", "==", filters.status));
      }

      if (filters.category) {
        constraints.push(where("category", "==", filters.category));
      }

      // Add ordering
      constraints.push(orderBy("createdAt", "desc"));

      complaintsQuery = query(collection(db, "complaints"), ...constraints);
    }

    const querySnapshot = await getDocs(complaintsQuery);
    const complaints = [];

    querySnapshot.forEach((doc) => {
      complaints.push({ id: doc.id, ...doc.data() });
    });

    console.log(
      `Fetched ${complaints.length} complaints with filters:`,
      filters
    );
    return { success: true, complaints };
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return { success: false, error: error.message, complaints: [] };
  }
};

export const getComplaintById = async (complaintId) => {
  try {
    const complaintDoc = await getDoc(doc(db, "complaints", complaintId));

    if (complaintDoc.exists()) {
      return {
        success: true,
        complaint: { id: complaintDoc.id, ...complaintDoc.data() },
      };
    } else {
      return { success: false, error: "Complaint not found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateComplaintStatus = async (
  complaintId,
  status,
  userId,
  note = ""
) => {
  try {
    const complaintRef = doc(db, "complaints", complaintId);

    const statusUpdate = {
      status,
      updatedAt: serverTimestamp(),
      statusHistory: arrayUnion({
        status,
        updatedBy: userId,
        updatedAt: new Date(),
        note,
      }),
    };

    if (status === "resolved" || status === "closed") {
      statusUpdate.resolvedAt = serverTimestamp();
    }

    await updateDoc(complaintRef, statusUpdate);

    console.log(`Complaint ${complaintId} status updated to ${status}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating complaint:", error);
    return { success: false, error: error.message };
  }
};

export const assignComplaint = async (complaintId, officerId, officerName) => {
  try {
    const complaintRef = doc(db, "complaints", complaintId);

    await updateDoc(complaintRef, {
      assignedOfficer: officerId,
      officerName,
      status: "assigned",
      updatedAt: serverTimestamp(),
      statusHistory: arrayUnion({
        status: "assigned",
        updatedBy: officerId,
        updatedAt: new Date(),
        note: `Assigned to ${officerName}`,
      }),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
