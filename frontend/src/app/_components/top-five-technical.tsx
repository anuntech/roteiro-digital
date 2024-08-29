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

type TechnicalInputProps = {
  label: string;
  name: string;
};

export function TopFiveTechnical() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Os cinco melhores técnicos</CardTitle>
        <CardDescription>
          Realizaram um total de R$ 1.000.000,00
        </CardDescription>
      </CardHeader>
      <CardContent>aaa</CardContent>
    </Card>
  );
}
