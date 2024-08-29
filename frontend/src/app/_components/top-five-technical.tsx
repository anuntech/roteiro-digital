import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type TopFiveTechnicalInputProps = {
  technical_name: string;
  technical: string;
  total_received_value: string;
};

export function TopFiveTechnical({
  technical,
}: {
  technical: TopFiveTechnicalInputProps[];
}) {
  const totalSum = technical.reduce((accumulator, current) => {
    return accumulator + Number(current.total_received_value);
  }, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Os cinco melhores técnicos</CardTitle>
        <CardDescription>Realizaram um total de R$ {totalSum}</CardDescription>
      </CardHeader>
      <CardContent className="mt-10 h-full">
        <div className="space-y-8">
          {technical.map((val) => (
            <div className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {val.technical_name}
                </p>
                <p className="text-sm text-muted-foreground">{val.technical}</p>
              </div>
              <div className="ml-auto font-medium">
                +R${val.total_received_value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
