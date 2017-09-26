// Maps interface keys to optional
export type Optional<T> = { [P in keyof T]?: T[P] };
// Maps interface keys to nullable
export type Nullable<T> = { [P in keyof T]: T[P] | null };
