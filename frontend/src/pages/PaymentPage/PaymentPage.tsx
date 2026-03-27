import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PaymentMain from "./component/PaymentMain";

export const PaymentPage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen w-full">
      <Header />
      <div className="w-full mx-auto">
        <main>
            <PaymentMain/>
        </main>
        <Footer />
      </div>
    </div>
  );
};
