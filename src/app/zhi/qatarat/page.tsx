'use client'
import React, {  } from "react";
import { useRouter } from "next/navigation";
import QataratLoader from "./QataratLoader";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/Loader";
 
const MyOcean = () => {
  const auth = useAuth()
  const router = useRouter()
  if(!auth.isAuthenticated && !auth.isLoading){
      router.push('/auth/login')
  }
  return <Loader isLoading={auth.isLoading}>
    <QataratLoader user={auth.currentUser!} />
  </Loader>;
 
};

export default MyOcean;