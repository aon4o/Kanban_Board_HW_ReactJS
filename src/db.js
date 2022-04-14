import Dexie from 'dexie';

export const db = new Dexie('kanban');

db.version(10).stores({
    users: '++id, &username, password',
    boards: '++id, &name, user_id',
    columns: '++id, name, position, board_id',
    cards: '++id, title, description, user_id, column_id, board_id',
    recent: '++id, [user_id+board_id]'
});
