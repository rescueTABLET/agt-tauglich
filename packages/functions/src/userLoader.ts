import { getFirestore } from "firebase-admin/firestore";
import { firebase } from "./admin";

export async function* paginatedUsers(
  pageSize: number = 100,
  db: FirebaseFirestore.Firestore = getFirestore(firebase)
): AsyncGenerator<FirebaseFirestore.QueryDocumentSnapshot[], void, unknown> {
  let lastDoc: FirebaseFirestore.QueryDocumentSnapshot | null = null;
  let hasMore = true;

  while (hasMore) {
    // Build paginated query
    let query = db.collection("users").limit(pageSize);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const usersSnapshot = await query.get();

    if (usersSnapshot.empty) {
      hasMore = false;
      break;
    }

    yield usersSnapshot.docs;

    // Set up for next page
    if (usersSnapshot.docs.length < pageSize) {
      hasMore = false;
    } else {
      lastDoc = usersSnapshot.docs[usersSnapshot.docs.length - 1];
    }
  }
}
