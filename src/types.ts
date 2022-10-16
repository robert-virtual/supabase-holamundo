export interface IProduct{
    id?:number
    name:string
    description:string
    price:number
    stock:number
    created_at?:Date
}
export interface IDatabase{
  public:{
    Tables:{
      products:{
        Row:IProduct,
        Insert:IProduct,
        Update:IProduct
      },
    }
  }
}
