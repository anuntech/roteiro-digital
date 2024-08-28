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
import { useGlobalClassificationStatsContext } from "@/app/context/os-classification-stats";

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
  const { classificationStats } = useGlobalClassificationStatsContext();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>MOTIVOS DE IMPRODUTIVIDADES</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={classificationStats.length > 0 ? classificationStats : data}
            margin={{
              top: 40,
            }}
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
                value.length > 14 ? value.slice(0, 13) + "..." : value
              }
              padding={{ left: 0, right: 0 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="quantity" fill="var(--color-quantity)" radius={8}>
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
