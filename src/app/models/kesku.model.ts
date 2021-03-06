export interface All {
    userId: number;
    akun: Akun[];
    trx: Trx[];
}

export interface Akun {
    id_akun: number;
    id_book: number;
    akunName: string;
    akunType: number;
    akunTypeName: string;
    position: number;
    stamp: number;
    total: number;
    deleteable?: boolean;
}

export interface Trx {
    id_trx: number;
    id_book: number;
    id_akun: number;
    to_akun: number;
    debit: number;
    kredit: number;
    stamp: number;
    akunName?: string;
    toName?: string;
    amount?: number;
}