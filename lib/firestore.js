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

  if (journey.connecting) {
    const leg1 = journey.legs[0];
    const leg2 = journey.legs[1];
    return addDoc(ref, {
      uid,
      connecting: true,
      via: journey.via,
      train: journey.train,
      from: leg1.from,
      to: leg2.to,
      totalPrice: journey.totalPrice,
      totalDuration: journey.totalDuration,
      leg1: {
        train: leg1.train,
        from: leg1.from,
        to: leg1.to,
        fromStation: leg1.fromStation || "",
        fromCode: leg1.fromCode || "",
        toStation: leg1.toStation || "",
        toCode: leg1.toCode || "",
        departure: leg1.departure || "",
        arrival: leg1.arrival || "",
        durationHours: leg1.durationHours,
        price: leg1.price,
        comfort: leg1.comfort,
        reliability: leg1.reliability || "",
      },
      leg2: {
        train: leg2.train,
        from: leg2.from,
        to: leg2.to,
        fromStation: leg2.fromStation || "",
        fromCode: leg2.fromCode || "",
        toStation: leg2.toStation || "",
        toCode: leg2.toCode || "",
        departure: leg2.departure || "",
        arrival: leg2.arrival || "",
        durationHours: leg2.durationHours,
        price: leg2.price,
        comfort: leg2.comfort,
        reliability: leg2.reliability || "",
      },
      reason: reason?.reason || (typeof reason === "string" ? reason : ""),
      notes: reason?.notes || [],
      query: userQuery || "",
      savedAt: serverTimestamp(),
    });
  }

  return addDoc(ref, {
    uid,
    train: journey.train,
    from: journey.from,
    to: journey.to,
    fromStation: journey.fromStation || "",
    fromCode: journey.fromCode || "",
    toStation: journey.toStation || "",
    toCode: journey.toCode || "",
    departure: journey.departure || "",
    arrival: journey.arrival || "",
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
