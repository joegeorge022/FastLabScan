export type QRReturn = {
    regNo: string,
    time: number
  }
  
export interface RowData extends QRReturn {
    name: string,
    dept: string,
}