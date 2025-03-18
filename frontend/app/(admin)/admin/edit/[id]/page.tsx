import EditProductForm from "@/components/admin/product/EditForm";
import { BACKEND_URL } from "@/config/config"
import axios from "axios"

const getProduct = async(id : string)=>{
    const res = await axios.get(`${BACKEND_URL}/api/v1/product/${id}`);

    return res.data;
}

export default async function Page({params} : {
    params : Promise<{id:string}>
}){
    const id = (await params).id;
    const product = await getProduct(id);
    console.log(product);
    
    return (
        <EditProductForm product={product} />
    )
}