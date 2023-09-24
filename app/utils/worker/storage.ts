import Dexie from "dexie";

const DATABASE_NAME = "client-state";
const STORES = {
  connectivity: "id, status",
};

interface Connectivity {
  id?: number;
  status: string;
}

const isUserOnline = () => {
  return navigator.onLine;
}

function createStorageRepository() {
  const db = new Dexie(DATABASE_NAME, { autoOpen: true });
  db.version(1).stores(STORES);

  const connectivity = db.table<Connectivity>("connectivity");
  connectivity.put({ status: isUserOnline() ? "online" : "offline", id: 1 });

  return {
    connectivity: db.table<Connectivity>("connectivity"),
  };
}

export default createStorageRepository;
