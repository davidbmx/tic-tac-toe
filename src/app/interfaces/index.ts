export interface User {
    uid: string;
    displayName: string;
    photoUrl: string;
}

export interface Game {
    userO: User;
    userX: User;
    active: boolean;
    squares: Array<string>;
    winner: User;
    xIsNext: boolean;
    game: number;
    tie: boolean;
    id?: string;
}

export interface UserScore {
    user: User;
    score: number;
    update: number;
    cerate: number;
}
