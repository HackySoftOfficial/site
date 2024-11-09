import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function getDynamicMetadata() {
  try {
    const settingsDoc = await getDoc(doc(db, "settings", "general"));
    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      return {
        siteName: data.siteName || null,
        supportEmail: data.supportEmail || null,
      };
    }
    return { siteName: null, supportEmail: null };
  } catch (error) {
    console.error("Error loading metadata:", error);
    return { siteName: null, supportEmail: null };
  }
} 