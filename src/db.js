import Dexie from 'dexie';

export const db = new Dexie('kanban');

db.version(14).stores({
    users: '++id, &username, password',
    boards: '++id, &name, user_id',
    columns: '++id, name, position, board_id',
    cards: '++id, title, description, user_id, column_id, board_id, assignee_id, created_at',
    recent: '++id, &[user_id+board_id]',
    labels: '++id, title, color, board_id',
    card_labels: '++id, &[card_id+label_id]'
});
