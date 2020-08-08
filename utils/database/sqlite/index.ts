import SQLite from "react-native-sqlite-storage";
import {AppState, AppStateStatus} from "react-native";
import configuration from "./config";
import pagination from "../../pagination";
let db:SQLite.SQLiteDatabase | undefined;

export const _getAllBookmark = async (page?:number) => {
  try {
      const [connection] = await getDB().then((db) => db.executeSql('SELECT * FROM bookmark'));
      const todos = [];
      for (let i = 0;i < connection.rows.length;i++) {
          todos.push(connection.rows.item(i))
      };
      return pagination(todos,page > 1 ? page : 1,10);
  } catch (e) {
      return Promise.reject(e);
  }
};
export const _getBookmarkId = async (id:string) => {
    try {
        const [ connection ] = await getDB().then((db) => db.executeSql('select * from bookmark where id = ?',[id]));
        return connection.rows.item(connection.rows.length - 1)
    } catch (e) {
        return Promise.reject(e);
    }
};
export const _setBookmark = async (id:string,title:string,image:string) => {
  try {
      const [ connection ] = await getDB()
          .then((db) =>
              db.executeSql(`insert into bookmark (id,title,image) values (?,?,?)`,[id,title,image]));
      return connection;
  }  catch (e) {
      return Promise.reject(e);
  }
};
export const _delBookmark = async (id:string) => {
    try {
        const [connection] = await getDB()
            .then((db) => db.executeSql('delete from bookmark WHERE id = ?',[id]));
        return connection;
    } catch (e) {
        return Promise.reject(e);
    }
};
const getDB = async () => {
    if (db !== undefined) {
        return Promise.resolve(db);
    }
    return open();
};
const open = async ():Promise<SQLite.SQLiteDatabase> => {
    SQLite.DEBUG(false);
    SQLite.enablePromise(true);
    if (db) {
        return db;
    }
    const database = await SQLite.openDatabase({
        name:'bk2020.sqlite',
        location:'default'
    });
    await configuration(database);
    db = database;
    return database;
};
const close = async () => {
    if (db === undefined) {
        return;
    }
    db.close();
    db = undefined;
};

let appState:AppStateStatus = "active";
const updateUI = (state:AppStateStatus) => {
    if (appState === "active" && state.match(/inactive|background/)) { close(); }
    appState = state;
}

AppState.addEventListener('change',updateUI);