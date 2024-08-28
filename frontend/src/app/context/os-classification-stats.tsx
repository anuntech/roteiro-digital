"use client";

import { createContext, useContext, useState } from "react";

interface OrderStatus {
  value: string;
  quantity: number;
}

interface OrderStatusContextProps {
  orderStatus: OrderStatus[];
  setOrderStatus: React.Dispatch<React.SetStateAction<OrderStatus[]>>;
}

const GlobalOrderStatusContext = createContext<any>({
  orderStatus: [],
  setOrderStatus: () => {},
});

export const GlobalClassificationStatsWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  let [orderStatus, setOrderStatus] = useState<OrderStatusContextProps[]>([]);

  return (
    <GlobalOrderStatusContext.Provider value={{ orderStatus, setOrderStatus }}>
      {children}
    </GlobalOrderStatusContext.Provider>
  );
};

type Props = {
  orderStatus: [];
  setOrderStatus: (data: OrderStatus) => void;
};

export const useGlobalOrderStatusContext = () => {
  return useContext<Props>(GlobalOrderStatusContext);
};
