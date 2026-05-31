// custom types
export type answer = {
    aNo: number;
    aT: string;
};
export type question = {
    q: string;
    a: answer[];  // [answer, answer, answer, answer] throws an error magically
    c: number[];
};
