import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Os cinco melhores técnicos</CardTitle>
        <CardDescription>
          Realizaram um total de R$ 1.000.000,00
        </CardDescription>
      </CardHeader>
      <CardContent>
        {technical.map((val) => {
          return val.technical_name;
        })}
      </CardContent>
    </Card>
  );
}
