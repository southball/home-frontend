export default function RangeArray(lo: number, hi: number): number[] {
    const arr: number[] = [];

    const ilo = Math.floor(lo);
    const ihi = Math.floor(hi);

    for (let i = 0; i <= ihi - ilo; i++)
        arr.push(Math.floor(ilo + i));

    return arr;
}