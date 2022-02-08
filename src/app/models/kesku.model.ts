export interface All {
    akun: Akun[]
}

export interface Akun {
    id_akun: number;
    id_book: number;
    akunName: string;
    akunType: number;
    // budgeted: number;
    // periode: number;
    // is_active: number;
    // stamp: number;
}