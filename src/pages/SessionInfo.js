import CommonButtton from "@/components/Buttons/CommonButton";
import { useRouter } from "next/router";
import React from "react";

export default function SessionInfo() {
  const router = useRouter();
  const handleCreateSession = () => {
    router.push("/SessionCreator");
  };
  return (
    <>
      <div className="flex justify-between m-2 p-5 ">
        <div className="bg-[#B52326] text-white text-[10px] px-2 md:px-3 rounded-lg md:text-lg">
          <CommonButtton
            text="+ Create Quiz Session"
            onClick={handleCreateSession}
          />
        </div>

        <input
          type="text"
          placeholder="Search by CMS_id or Test_name"
          className=" rounded-md border-black border-solid border text-xs md:text-md md:px-4 md:w-1/5 "
        />
      </div>
    </>
  );
}
