"use client";

import { createContext, useContext, useState } from "react";

interface ClassificationStats {
  value: string;
  quantity: number;
}

interface ClassificationStatsContextProps {
  classificationStats: ClassificationStats[];
  setClassificationStats: React.Dispatch<
    React.SetStateAction<ClassificationStats[]>
  >;
}

const GlobalClassificationStatsContext = createContext<any>({
  classificationStats: [],
  setClassificationStats: () => {},
});

export const GlobalClassificationStatsWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  let [classificationStats, setClassificationStats] = useState<
    ClassificationStatsContextProps[]
  >([]);

  return (
    <GlobalClassificationStatsContext.Provider
      value={{ classificationStats, setClassificationStats }}
    >
      {children}
    </GlobalClassificationStatsContext.Provider>
  );
};

type Props = {
  classificationStats: [];
  setClassificationStats: (data: ClassificationStats) => void;
};

export const useGlobalClassificationStatsContext = () => {
  return useContext<Props>(GlobalClassificationStatsContext);
};
