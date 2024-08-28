"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGlobalOrderStatusContext } from "@/app/context/os-classification-stats";

const chartConfig = {
  quantity: {
    label: "Quantity",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type dataInput = {
  value: string;
  quantity: number;
};

export function BarChartComponent({
  className,
  data,
}: {
  className: string;
  data: dataInput[];
}) {
  const { orderStatus } = useGlobalOrderStatusContext();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>MOTIVOS DE IMPRODUTIVIDADES</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={orderStatus.length > 0 ? orderStatus : data}
            width={500}
            onClick={(v) => console.log(v)}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="value"
              tickMargin={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                value.length > 14 ? value.slice(0, 4) + "..." : value
              }
              padding={{ left: 0, right: 0 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="quantity" fill="var(--bar-color)" radius={8}>
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
