import Dexie from 'dexie';

export const db = new Dexie('kanban');

db.version(7).stores({
    users: '++id, &username, password', // id - PK, username - unique str, password - hash
    boards: '++id, &name, user_id', // id - PK, name - unique str, user_id - FK
    columns: '++id, name, position, board_id', // id - PK, name - unique str, position - int, table_id - FK
    cards: '++id, title, description, user_id, column_id', // id - PK, user_id - FK
});