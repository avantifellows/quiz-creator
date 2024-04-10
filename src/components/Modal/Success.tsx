import React from 'react';
import { Check } from 'react-feather';

export const Success = ({ show, type }: { show: boolean; type: string }) => {
  let message = '';
  if (type === 'create') {
    message =
      'Your session request is added. Please wait while we generate quiz links. Redirecting to Home';
  } else if (type === 'edit') {
    message = 'Your changes have been saved. Redirecting to Home.';
  } else {
    message = 'Redirecting to home';
  }

  return (
    <section
      className={`fixed ${
        show ? 'block' : 'hidden'
      } inset-0 w-screen bg-gray-400/40 backdrop-blur-md`}
    >
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 rounded-md px-5 py-10 bg-white text-center ">
        <div className="relative">
          <div className="m-auto h-32 aspect-square rounded-full border-4 border-solid border-current border-r-transparent text-primary animate-spin " />
          <Check
            className=" text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            size={100}
          />
        </div>
        <p className="text-xl">{message}</p>
      </div>
    </section>
  );
};
