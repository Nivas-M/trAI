import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

export async function createOrUpdateUser(user) {
  const ref = doc(db, "users", user.uid);
  await setDoc(
    ref,
    {
      email: user.email,
      displayName: user.displayName || null,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function saveJourney(uid, journey, reason, userQuery) {
  const ref = collection(db, "journeys");
  return addDoc(ref, {
    uid,
    train: journey.train,
    from: journey.from,
    to: journey.to,
    durationHours: journey.durationHours,
    price: journey.price,
    comfort: journey.comfort,
    reliability: journey.reliability || "",
    reason: reason?.reason || (typeof reason === "string" ? reason : ""),
    notes: reason?.notes || [],
    query: userQuery || "",
    savedAt: serverTimestamp(),
  });
}

export async function getSavedJourneys(uid) {
  const q = query(
    collection(db, "journeys"),
    where("uid", "==", uid),
    orderBy("savedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteSavedJourney(journeyId) {
  await deleteDoc(doc(db, "journeys", journeyId));
}

export async function saveConversation(uid, messages, results, reasoning) {
  const ref = collection(db, "conversations");
  return addDoc(ref, {
    uid,
    messages,
    results,
    reasoning,
    createdAt: serverTimestamp(),
  });
}

export async function getConversations(uid) {
  const q = query(
    collection(db, "conversations"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
