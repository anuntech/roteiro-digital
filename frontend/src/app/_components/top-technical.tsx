import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-currency";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { avatarList } from "../data/data";

export type TopTechnicalInputProps = {
  technical_name: string;
  technical: string;
  total_received_value: string;
  executed_services: number;
};

export function TopTechnical({
  technical,
}: {
  technical: TopTechnicalInputProps[];
}) {
  const totalSum = technical?.reduce((accumulator, current) => {
    return accumulator + Number(current.total_received_value);
  }, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top vendedores</CardTitle>
        <CardDescription>
          Realizaram um total de {formatCurrency(totalSum)}
        </CardDescription>
      </CardHeader>
      <CardContent className="scrollbar-hide max-h-[400px] overflow-y-auto">
        <div className="space-y-8">
          {technical?.map((val) => {
            const randomIndex = Math.floor(Math.random() * avatarList.length);

            return (
              <div className="flex items-center">
                <Avatar>
                  <AvatarImage src={avatarList[randomIndex]} />
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {val.technical_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {val.executed_services} Serviços Executados
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {formatCurrency(parseInt(val.total_received_value))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
