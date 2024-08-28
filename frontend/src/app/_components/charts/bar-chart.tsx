"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "AAAAAAAAAAAA", desktop: 186 },
  { month: "BBBBBBBBBBBBBBB", desktop: 305 },
  { month: "CCCCCCCCCCCCCCCCCCCCCCCC", desktop: 237 },
  { month: "DDDDDDDDDDDDDDDDDDDDDDDDDDD", desktop: 73 },
  { month: "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE", desktop: 209 },
  { month: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF", desktop: 214 },
  { month: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF", desktop: 214 },
  { month: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF", desktop: 214 },
  { month: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF", desktop: 214 },
  { month: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function BarChartComponent({ className }: { className: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>MOTIVOS DE IMPRODUTIVIDADES</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 40,
            }}
            width={500}
            onClick={(v) => console.log(v)}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 6)}
              padding={{ left: 0, right: 0 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
