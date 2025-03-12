"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Edit, Eye, Trash2 } from "lucide-react";


const Actions = ({ productId, handleDelete }: { 
    productId: string;
    handleDelete : (id:string) => void;
}) => {
    
  return (
    <div className="flex space-x-3">
      <button className="text-blue-600 hover:text-blue-900">
        <Eye size={20} />
      </button>
      <button className="text-green-600 hover:text-green-900">
        <Edit size={20} />
      </button>
      {/* <button className="text-red-600 hover:text-red-900"> */}
        <DeleteButton productId={productId} onDelete={handleDelete} />
      {/* </button> */}
    </div>
  );
};

export default Actions;

function DeleteButton({ productId, onDelete } : {
    productId : string,
    onDelete : (id : string) => void;
}) {
    return (
      <AlertDialog>
        <AlertDialogTrigger className="text-red-600 hover:text-red-900">
          <Trash2 size={20}/>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disable this Product? This will disable visibility of this product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white"
              onClick={() => onDelete(productId)}
            >
              Yes, Disable
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  